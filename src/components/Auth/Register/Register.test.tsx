import React from "react"
import { shallow } from "enzyme"
import { Register } from "./Register"
import { Providers } from "../../Providers/Providers"

describe("Register", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    const loginMock = jest.fn()
    shallow(
      <Providers>
        <Register login={loginMock} />
      </Providers>
    )
  })
})
