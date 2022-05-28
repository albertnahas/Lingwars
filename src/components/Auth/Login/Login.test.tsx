import React from "react"
import { shallow } from "enzyme"
import { Login } from "./Login"
import { Providers } from "../../Providers/Providers"

describe("Login", function () {
  console.error = jest.fn()

  it("renders without crashing", () => {
    const signUpMock = jest.fn()
    shallow(
      <Providers>
        <Login signUp={signUpMock} />
      </Providers>
    )
  })
})
