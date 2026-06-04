import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

function Hello() {
  return <div>hello world</div>
}

describe("basic", () => {
  it("renders a simple component", () => {
    render(<Hello />)
    expect(screen.getByText("hello world")).toBeInTheDocument()
  })
})
