import React from "react"
import { mount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"

describe("App renders", () => {
  beforeEach(() => {
    cy.login()
    mount(
      <Providers>
        <App />
      </Providers>
    )
  })

  it("Adds document to test collection of Firestore", () => {
    cy.callFirestore("add", "test", { some: "value" })
  })

  it("renders main menu", () => {
    cy.get("h4").contains("Main Menu")
  })
})
