import React from "react"
import { mount } from "@cypress/react"
import App from "../../src/App"
import { Providers } from "../../src/components/Providers/Providers"

describe("Main Menu", () => {
  beforeEach(() => {
    cy.login()
  })

  it("Starts with correct setup for single player", () => {
    mount(
      <Providers>
        <App />
      </Providers>
    )
    cy.get(`[aria-label="single player"]`).click()
    cy.get(`[aria-label="players"] input`).should("have.value", "1")
    cy.get(`[aria-label="rounds"] input`).should("have value", "10")
    cy.get(`[aria-label="level"] input[checked]`).should("have.value", "1")
  })

  it("Starts with correct setup for multiplayer", () => {
    mount(
      <Providers>
        <App />
      </Providers>
    )
    cy.get(`[aria-label="multi player"]`).click()
    cy.get(`[aria-label="players"] input`).should("have.value", "2")
    cy.get(`[aria-label="rounds"] input`).should("have value", "10")
    cy.get(`[aria-label="level"] input[checked]`).should("have.value", "1")
  })
})
