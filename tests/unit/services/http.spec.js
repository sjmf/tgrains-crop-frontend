import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import http from '@/services/http'

vi.mock('axios')

// What axios resolves with after following the 303 to /api/status/<id>
const statusResponse = (data, id = 'abc') => ({
    data,
    request: { responseURL: `http://localhost/api/status/${id}` },
})

beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(http, 'sleep').mockResolvedValue()   // don't wait 500 ms per poll
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'debug').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('checkCeleryStatus', () => {
    it('returns immediately when the task already succeeded', async () => {
        const res = statusResponse({ state: 'SUCCESS', result: 1 })
        await expect(http.checkCeleryStatus(res)).resolves.toBe(res)
        expect(axios.get).not.toHaveBeenCalled()
    })

    it('polls the status path until the task finishes', async () => {
        axios.get
            .mockResolvedValueOnce(statusResponse({ state: 'STARTED' }))
            .mockResolvedValueOnce(statusResponse({ state: 'SUCCESS', result: 42 }))

        const res = await http.checkCeleryStatus(statusResponse({ state: 'PENDING' }, 'task-1'))
        expect(res.data.result).toBe(42)
        expect(axios.get).toHaveBeenCalledTimes(2)
        expect(axios.get).toHaveBeenCalledWith('/api/status/task-1')
    })

    it('rejects a 200 response that is not JSON (e.g. an HTML error page)', async () => {
        axios.get.mockResolvedValueOnce(statusResponse('<html>'))
        await expect(http.checkCeleryStatus(statusResponse({ state: 'PENDING' })))
            .rejects.toThrow('did not contain valid JSON')
    })

    it('rejects JSON without a state', async () => {
        axios.get.mockResolvedValueOnce(statusResponse({}))
        await expect(http.checkCeleryStatus(statusResponse({ state: 'PENDING' })))
            .rejects.toThrow('valid application state')
    })

    it('extracts and capitalises the model error message on failure', async () => {
        const res = statusResponse({
            state: 'FAILURE',
            status: 'RuntimeError: invalid_argument: ERROR: cropping area exceeds the landscape',
        })
        await expect(http.checkCeleryStatus(res)).rejects.toBe('Cropping area exceeds the landscape')
    })

    it('falls back to the raw status for other failures', async () => {
        const res = statusResponse({ state: 'REVOKED', status: 'terminated' })
        await expect(http.checkCeleryStatus(res)).rejects.toBe('Query REVOKED with message: terminated')
    })
})

describe('API calls', () => {
    it('queryModel POSTs the payload and returns the task result', async () => {
        axios.post.mockResolvedValueOnce(statusResponse({ state: 'SUCCESS', result: { profit: 1 } }))
        await expect(http.queryModel({ landscape_id: 101, wheat: 5 })).resolves.toEqual({ profit: 1 })
        expect(axios.post).toHaveBeenCalledWith('/api/model', { landscape_id: 101, wheat: 5 })
    })

    it('queryModel rethrows failures as strings for the message box', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network Error'))
        await expect(http.queryModel({})).rejects.toBe('Error: Network Error')
    })

    it('loadBAUState and loadStrings pass the landscape id as a query parameter', async () => {
        axios.get.mockResolvedValue(statusResponse({ state: 'SUCCESS', result: 'ok' }))
        await http.loadBAUState(102)
        await http.loadStrings(102)
        expect(axios.get).toHaveBeenCalledWith('/api/model', { params: { landscape_id: 102 } })
        expect(axios.get).toHaveBeenCalledWith('/api/strings', { params: { landscape_id: 102 } })
    })

    it('loadComments sends paging and filter parameters', async () => {
        axios.get.mockResolvedValueOnce({ data: { comments: [] } })
        await http.loadComments(2, 4, { landscape_id: 101, sort: 1 })
        expect(axios.get).toHaveBeenCalledWith('/api/comment',
            { params: { page: 2, size: 4, landscape_id: 101, sort: 1 } })
    })

    it('postState and postComment POST to their routes', async () => {
        axios.post.mockResolvedValue({ data: {} })
        await http.postState({ session_id: 's' })
        await http.postComment({ text: 't' })
        expect(axios.post).toHaveBeenCalledWith('/api/state', { session_id: 's' })
        expect(axios.post).toHaveBeenCalledWith('/api/comment', { text: 't' })
    })
})
