import { describe, expect, it } from "vitest";

import { createFleetNavCountStore } from "./fleet-nav-count-store";

describe("createFleetNavCountStore", () => {
  it("starts with the given badge", () => {
    const store = createFleetNavCountStore({ count: 20, label: "20 devices" });
    expect(store.getSnapshot()).toEqual({ count: 20, label: "20 devices" });
  });

  it("notifies subscribers when the badge changes", () => {
    const store = createFleetNavCountStore();
    let heard = 0;
    store.subscribe(() => {
      heard += 1;
    });

    store.set(4, "4 of 20 devices match the filters");

    expect(heard).toBe(1);
    expect(store.getSnapshot()).toEqual({
      count: 4,
      label: "4 of 20 devices match the filters",
    });
  });

  it("hides the badge when the count is cleared", () => {
    const store = createFleetNavCountStore({ count: 20, label: "20 devices" });
    store.set(undefined);
    expect(store.getSnapshot()).toEqual({ count: undefined, label: undefined });
  });

  it("keeps two badges independent", () => {
    const fleet = createFleetNavCountStore({ count: 27, label: "27 devices" });
    const biomed = createFleetNavCountStore();

    biomed.set(2, "2 devices");

    expect(fleet.getSnapshot().count).toBe(27);
    expect(biomed.getSnapshot()).toEqual({ count: 2, label: "2 devices" });
  });

  it("does not notify a listener after unsubscribe", () => {
    const store = createFleetNavCountStore();
    let heard = 0;
    const stop = store.subscribe(() => {
      heard += 1;
    });

    stop();
    store.set(1, "1 device");

    expect(heard).toBe(0);
  });
});
