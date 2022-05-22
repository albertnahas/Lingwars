import React from "react"
import { mount, unmount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"

beforeEach(() => {
  cy.login()
  mount(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>
  )
})
afterEach(() => {
  cy.logout()
  unmount()
})

describe("Game starts for one player", () => {
  it("Starts single player challenge", () => {
    cy.get(`[aria-label="single player"]`).click()
    cy.get(`[aria-label="submit setup"]`).click()
    // renders audio
    cy.get(`[aria-label="audio container"]`).should("have.length", 1)
    cy.get(`[class="timer"]`).should("contain.text", "00:00")
  })
})

describe("Side drawer returns to Main Menu", () => {
  it("Starts multi player challenge", () => {
    cy.get(`[aria-label="open drawer"]`).click()
    cy.get(`[aria-label="Home"]`).click()
    cy.get("h4").contains("Main Menu")
  })
})

describe("Game starts for multi player", () => {
  it("Starts multi player challenge", () => {
    cy.get(`[aria-label="multi player"]`).click()
    cy.get(`[aria-label="submit setup"]`).click()
    cy.get(`[aria-label="Challenge Link"]`).should("have.length", 1)
  })
})
