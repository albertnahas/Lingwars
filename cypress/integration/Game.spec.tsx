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
  // const TEST_UID = Cypress.env("TEST_UID")
  let challengeId = ""

  it("Starts multi player challenge", () => {
    cy.get(`[aria-label="multi player"]`).click()
    cy.get(`[aria-label="submit setup"]`).click()
    cy.get(`[aria-label="Challenge Link"]`).should("have.length", 1)
    cy.get(`[aria-label="Challenge Link"]`)
      .find("span")
      .invoke("text")
      .then((text) => {
        expect(text.split("/").length).equal(5)
        challengeId = text.split("/")[4]
        cy.callFirestore("get", `challenges/${challengeId}`).then((r) => {
          cy.log("get returned: ", r)
          cy.wrap(r).its("players").should("equal", 2)
        })
      })
    cy.get(`[aria-label="start"]`).click()
    cy.get(`[aria-label="waiting for players"]`).should("have.length", 1)
    // cy.callFirestore(
    //   "get",
    //   `challenges/${challengeId}/players/${TEST_UID}`
    // ).then((r) => {
    //   cy.log("get returned: ", r)
    //   cy.wrap(r).its("turn").should("equal", 0)
    // })
  })
})
