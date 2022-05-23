import React from "react"
import { mount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"

describe("App renders", () => {
  beforeEach(() => {
    mount(
      <Providers>
        <App />
      </Providers>
    )
  })

  it("Adds document to test collection of Firestore", () => {
    cy.callFirestore("add", "test", { some: "value" })
  })

  it("Renders landing page", () => {
    cy.get("h1").contains("Lingwars")
  })
})
