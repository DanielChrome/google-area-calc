/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This example adds a user-editable rectangle to the map.
let restLatE: HTMLInputElement | null = null;
let restLngE: HTMLInputElement | null = null;
let swLatE: HTMLInputElement | null = null;
let swLngE: HTMLInputElement | null = null;
let neLatE: HTMLInputElement | null = null;
let neLngE: HTMLInputElement | null = null;

const data = {
  restaurant: {
    lat: 44.5452,
    lng: -78.5389
  },
  area: {
    north: 44.599,
    south: 44.49,
    east: -78.443,
    west: -78.649,
  }
}

function initHandles(): void {
  const btn = document.getElementById("submit");
  if (btn) {
    btn.addEventListener("click", (e: Event) => showArea());
  }
}

function showArea(): void {
  restLatE = document.getElementById('rest-lat') as HTMLInputElement | null;
  restLngE = document.getElementById('rest-lng') as HTMLInputElement | null;
  swLatE = document.getElementById('sw-lat') as HTMLInputElement | null;
  swLngE = document.getElementById('sw-lng') as HTMLInputElement | null;
  neLatE = document.getElementById('ne-lat') as HTMLInputElement | null;
  neLngE = document.getElementById('ne-lng') as HTMLInputElement | null;

  const value = restLatE?.value;
  console.log(value) // 👉️ "Initial value"

  if (restLatE && restLngE) {
    data.restaurant.lat = Number(restLatE.value);
    data.restaurant.lng = Number(restLngE.value);
  }
  if (swLatE && swLngE && neLatE && neLngE) {
    data.area.south = Number(swLatE.value);
    data.area.north = Number(neLatE.value);
    data.area.west = Number(swLngE.value);
    data.area.east = Number(neLngE.value);
  }

  initMap();
}

async function initMap(): Promise<void> {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: data.restaurant,
      zoom: 9,
    }
  );

  const marker = new google.maps.Marker({
    map,
    position: data.restaurant,
  });

  const bounds = data.area;

  // Define a rectangle and set its editable property to true.
  const rectangle = new google.maps.Rectangle({
    bounds: bounds,
    editable: true,
    draggable: true,
  });

  rectangle.setMap(map);

  // listen to changes
  ["bounds_changed", "dragstart", "drag", "dragend"].forEach((eventName) => {
    rectangle.addListener(eventName, () => {
      const bounds = rectangle.getBounds()?.toJSON()

      if (swLatE) swLatE.value = bounds?.south?.toString() || '';
      if (swLngE) swLngE.value = bounds?.west?.toString() || '';
      if (neLatE) neLatE.value = bounds?.north?.toString() || '';
      if (neLngE) neLngE.value = bounds?.east?.toString() || '';
    });
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
initHandles();
export {};
