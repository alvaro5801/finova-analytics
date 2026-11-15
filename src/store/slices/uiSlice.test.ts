/**
 * Testes unitários do estado de interface (src/store/slices/uiSlice.ts), com `node:test`.
 * Rode com `npm run test:unit`.
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import reducer, { toggleSidebar, toggleSidebarCollapsed } from "./uiSlice.ts";

const initial = () => reducer(undefined, { type: "@@init" });

describe("sidebar recolhida no desktop", () => {
  test("começa expandida", () => {
    assert.equal(initial().sidebarCollapsed, false);
  });

  test("toggleSidebarCollapsed recolhe", () => {
    assert.equal(reducer(initial(), toggleSidebarCollapsed()).sidebarCollapsed, true);
  });

  test("dois toggles voltam ao estado expandido", () => {
    const once = reducer(initial(), toggleSidebarCollapsed());
    assert.equal(reducer(once, toggleSidebarCollapsed()).sidebarCollapsed, false);
  });

  test("abrir o drawer não altera o estado recolhido", () => {
    const collapsed = reducer(initial(), toggleSidebarCollapsed());
    const next = reducer(collapsed, toggleSidebar());
    assert.equal(next.sidebarOpen, true);
    assert.equal(next.sidebarCollapsed, true);
  });
});
