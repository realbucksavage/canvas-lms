/*
 * Copyright (C) 2023 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {CollapsableList} from '../CollapsableList'

const defaultProps = {
  items: [
    {
      id: 'single-item-1',
      label: 'My single item 1',
    },
    {
      id: 'parent-item-1',
      label: 'My parent item 1',
      children: [
        {
          id: 'child-item-1',
          label: 'My child item 1',
        },
        {
          id: 'child-item-2',
          label: 'My child item 2',
        },
        {
          id: 'child-item-3',
          label: 'My child item 3',
        },
      ],
    },
    {
      id: 'single-item-2',
      label: 'My single item 2',
    },
    {
      id: 'parent-item-2',
      label: 'My parent item 2',
      children: [
        {
          id: 'child-item-4',
          label: 'My child item 4',
        },
      ],
    },
  ],
  onChange: jest.fn(),
}

const renderComponent = (overrideProps?: any) =>
  render(<CollapsableList {...defaultProps} {...overrideProps} />)

describe('CollapsableList', () => {
  it('render single items', () => {
    const component = renderComponent()
    expect(component.getByTestId('checkbox-single-item-1')).toBeInTheDocument()
    expect(component.getByTestId('checkbox-single-item-2')).toBeInTheDocument()
    // Labels are used for text and screen-reader
    expect(component.getAllByText('My single item 1')[1]).toBeInTheDocument()
    expect(component.getAllByText('My single item 2')[1]).toBeInTheDocument()
  })

  it('render parent item', () => {
    const component = renderComponent()
    expect(component.getByTestId('checkbox-parent-item-1')).toBeInTheDocument()
    expect(component.getByTestId('checkbox-parent-item-2')).toBeInTheDocument()
    // Labels are used for text and screen-reader
    expect(component.getAllByText('My parent item 1')[1]).toBeInTheDocument()
    expect(component.getAllByText('My parent item 2')[1]).toBeInTheDocument()
  })

  it('render children items on un-collapsed parent', () => {
    const component = renderComponent()
    userEvent.click(component.getByTestId('toggle-parent-item-1'))
    userEvent.click(component.getByTestId('toggle-parent-item-2'))
    expect(component.getByTestId('checkbox-child-item-1')).toBeInTheDocument()
    expect(component.getByTestId('checkbox-child-item-2')).toBeInTheDocument()
    expect(component.getByTestId('checkbox-child-item-3')).toBeInTheDocument()
    expect(component.getByTestId('checkbox-child-item-4')).toBeInTheDocument()
    expect(component.getByText('My child item 1')).toBeInTheDocument()
    expect(component.getByText('My child item 2')).toBeInTheDocument()
    expect(component.getByText('My child item 3')).toBeInTheDocument()
    expect(component.getByText('My child item 4')).toBeInTheDocument()
  })

  it('checks/un-checks box for single item', () => {
    const component = renderComponent({
      items: [
        {
          id: 'single-item-1',
          label: 'My single item 1',
        },
      ],
    })
    userEvent.click(component.getByTestId('checkbox-single-item-1'))
    expect(component.container.querySelectorAll('svg[name="IconCheckMark"]').length).toBe(1)
    userEvent.click(component.getByTestId('checkbox-single-item-1'))
    expect(component.container.querySelectorAll('svg[name="IconCheckMark"]').length).toBe(0)
  })

  it('calls onChange with correct params for single item', () => {
    const component = renderComponent()
    userEvent.click(component.getByTestId('checkbox-single-item-1'))
    expect(defaultProps.onChange).toHaveBeenCalledWith(['single-item-1'])
    userEvent.click(component.getByTestId('checkbox-single-item-1'))
    expect(defaultProps.onChange).toHaveBeenCalledWith([])
  })

  it('calls onChange with correct params for parent item', () => {
    const component = renderComponent()
    userEvent.click(component.getByTestId('checkbox-parent-item-1'))
    expect(defaultProps.onChange).toHaveBeenCalledWith(['parent-item-1'])
    userEvent.click(component.getByTestId('checkbox-parent-item-1'))
    expect(defaultProps.onChange).toHaveBeenCalledWith([])
  })

  it('calls onChange with correct params for child item', () => {
    const component = renderComponent()
    userEvent.click(component.getByTestId('toggle-parent-item-1'))
    userEvent.click(component.getByTestId('checkbox-child-item-1'))
    expect(defaultProps.onChange).toHaveBeenCalledWith(['child-item-1'])
    userEvent.click(component.getByTestId('checkbox-child-item-2'))
    expect(defaultProps.onChange).toHaveBeenCalledWith(['child-item-1', 'child-item-2'])
    userEvent.click(component.getByTestId('checkbox-child-item-3'))
    expect(defaultProps.onChange).toHaveBeenCalledWith(['parent-item-1'])
  })
})
