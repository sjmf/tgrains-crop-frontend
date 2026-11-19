import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentCard from '@/components/comments/CommentCard.vue'

const $store = {
    state: { readonly: false, comments: { sort: 0 }, tags: { tags: {} }, tag_groups: {} },
    dispatch: () => Promise.resolve(),
    commit: () => {},
}

const mountCard = (props) => mount(CommentCard, {
    props: { id: 1, author: 'Ann', user_id: 'u1', hash: 'abc', text: 'Hello', timestamp: 1795100000, tags: [], ...props },
    global: { mocks: { $store } },
})

describe('CommentCard', () => {
    it('shows the author, text and a timestamp', () => {
        const card = mountCard()
        expect(card.find('.username').text()).toBe('Ann')
        expect(card.find('.comment-text').text()).toBe('Hello')
        expect(card.find('.timestamp').text()).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/)
    })

    it('renders HTML in comment text and author names as text, never as markup', () => {
        // The server HTML-escapes input; the card decodes entities and relies on {{ }} escaping
        const card = mountCard({
            author: '&lt;b&gt;Mallory&lt;/b&gt;',
            text: '&lt;img src=x onerror=alert(1)&gt; &amp; <script>alert(2)</script>',
        })
        expect(card.find('.comment-text').text()).toBe('<img src=x onerror=alert(1)> & <script>alert(2)</script>')
        expect(card.find('.username').text()).toBe('<b>Mallory</b>')
        expect(card.find('.comment-text img').exists()).toBe(false)
        expect(card.find('script').exists()).toBe(false)
        expect(card.find('.username b').exists()).toBe(false)
    })

    it('emits filterUser when the author is clicked, except in reply view', async () => {
        const card = mountCard()
        await card.find('.username span').trigger('click')
        expect(card.emitted('filterUser')).toEqual([[{ user_id: 'u1', user_name: 'Ann' }]])

        const reply = mountCard({ reply_view: true })
        await reply.find('.username span').trigger('click')
        expect(reply.emitted('filterUser')).toBeUndefined()
    })
})
