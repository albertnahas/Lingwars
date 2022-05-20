import React from "react"
import { shallow } from "enzyme"
import SwitchToggle from "./SwitchToggle"

describe("SwitchToggle widget", function () {
  it("renders without crashing", () => {
    shallow(<SwitchToggle active={true} />)
  })
})
