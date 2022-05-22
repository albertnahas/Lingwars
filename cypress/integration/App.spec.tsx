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

  // it("Adds document to test_hello_world collection of Firestore", () => {
  //   cy.callFirestore("add", "test_hello_world", { some: "value" });
  // });

  it("renders main menu", () => {
    cy.get("h4", { timeout: 12000 }).contains("Main Menu")
  })
})
