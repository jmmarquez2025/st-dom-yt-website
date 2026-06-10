import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { createRoot } from "react-dom/client";
import { FloatingInput, FloatingTextarea } from "./Fields";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

function render(element) {
  React.act(() => {
    root.render(element);
  });
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  React.act(() => root.unmount());
  container.remove();
});

describe("FloatingInput", () => {
  it("associates the error message with the input via aria-describedby", () => {
    render(
      <FloatingInput
        label="Email"
        value="bad"
        onChange={() => {}}
        error="Enter a valid email"
        ariaDescribedBy="email-error"
      />
    );
    const input = container.querySelector("input");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("email-error");
    const message = container.querySelector("#email-error");
    expect(message.textContent).toBe("Enter a valid email");
  });

  it("renders no error node when valid and exposes the label", () => {
    render(
      <FloatingInput label="Name" required value="" onChange={() => {}} ariaDescribedBy="name-error" />
    );
    const input = container.querySelector("input");
    expect(input.getAttribute("aria-invalid")).toBe("false");
    expect(input.getAttribute("aria-label")).toBe("Name");
    expect(container.querySelector("#name-error")).toBeNull();
    expect(container.querySelector("label").textContent).toContain("Name");
  });

  it("runs onBlurValidate when focus leaves the field", () => {
    const validate = vi.fn();
    render(
      <FloatingInput label="Phone" value="" onChange={() => {}} onBlurValidate={validate} />
    );
    const input = container.querySelector("input");
    React.act(() => {
      input.focus();
      input.blur();
    });
    expect(validate).toHaveBeenCalledTimes(1);
  });
});

describe("FloatingTextarea", () => {
  it("wires error state the same way as the input", () => {
    render(
      <FloatingTextarea
        label="Message"
        value=""
        onChange={() => {}}
        error="Required"
        ariaDescribedBy="msg-error"
      />
    );
    const textarea = container.querySelector("textarea");
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector("#msg-error").textContent).toBe("Required");
  });
});
