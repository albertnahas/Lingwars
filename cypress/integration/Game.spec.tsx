import React from "react"
import { mount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"

describe("Game", () => {
  beforeEach(() => {
    cy.login()
    mount(
      <Providers>
        <App />
      </Providers>
    )
  })

  it("Starts single player challenge", () => {
    cy.get(`[aria-label="single player"]`, { timeout: 12000 }).click()
    cy.get(`[aria-label="submit setup"]`).click()
    // renders audio
    cy.get(`[aria-label="audio container"]`).should("have.length", 1)
    // timer starts with 00:00
    cy.get(`[class="timer"]`).should("contain.text", "00:00")
  })
})
