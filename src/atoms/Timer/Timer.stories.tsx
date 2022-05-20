import { Story, Meta } from "@storybook/react"

import { Timer, Props } from "./Timer"

export default {
  title: "atoms/Timer",
  component: Timer,
} as Meta

const Template: Story<Props> = (args) => <Timer {...args} />

export const Default = Template.bind({})
