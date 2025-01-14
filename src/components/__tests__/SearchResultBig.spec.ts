import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SearchResultBig from '@/components/SearchResultBig.vue'

describe('SearchResultBig', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchResultBig, {
      props: {
        name: 'Name',
        address: '1 Downy Lane',
        phone_number: '87654321',
        website: 'example.com',
      },
    })
    expect(wrapper.text()).toContain('Name')
  })
})
