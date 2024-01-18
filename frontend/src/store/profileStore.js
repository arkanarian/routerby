import { makeAutoObservable, runInAction, toJS } from "mobx";
import { api, apiOpertoureservice, methods, swapElements } from "../helpers";
import { authStore } from "./authStore";

class ProfileStore {
  constructor() {
    makeAutoObservable(this);
  }

  start = [53.933546, 27.690209]
  end = [53.933546, 27.690209]
  unoptimizedRoute = [
    // [54.060514, 27.296376],
    // [53.949732, 27.428645],
    // [54.002415, 27.280697],
  ]
  optimizedRoute = []
  places = []

  async doOptimizeRoute() {
    let unoptimizedRoute = []
    console.log(toJS(this.unoptimizedRoute))
    for (const location of toJS(this.unoptimizedRoute)) {
      unoptimizedRoute.push(swapElements(location, 0, 1))
    }
    console.log(unoptimizedRoute)
    const jobs = unoptimizedRoute.map((coords, i) => {
      console.log(coords)
      return {"id": i, "location": coords}
    })
    // const start = 
    // console.log(start)
    // const end = swapElements(toJS(this.end), 0, 1)
    // console.log(end)
    let body = {
      "jobs": jobs,
      "vehicles": [
        {
          "id": 1,
          "profile": "driving-car",
          "start": swapElements(toJS(this.start), 0, 1),
          "end": swapElements(toJS(this.end), 0, 1),
          "capacity": [100],
        },
      ]
    }
    const res = await apiOpertoureservice('optimization', methods.POST, JSON.stringify(body))
    if (!res.err) {
      this.optimizedRoute = []
      for (const step of res.data.routes[0].steps) {
        this.optimizedRoute.push(swapElements(step.location, 0, 1))
      }
    }
    else {
      console.log(res.data.error)
    }
  }

  async getPlaces() {
    const places_json = localStorage.getItem('route_cart')
    let places = []
    if (places_json) {
      places = JSON.parse(places_json)
    }
    const data = {ids: places}
    const result = await api('places/get_by_ids', methods.POST, JSON.stringify(data), authStore.token);
    runInAction(() => {
      this.places = result.data;
    })
    for (const place of this.places) {
      if (place.images[0]) {
        const img = await api(`places/image?file_name=${place.images[0].path}`, methods.GET, null, authStore.token, {'Content-Type': 'image/png'})
        const path = URL.createObjectURL(img.data)
        place.imageURL = path
      }
    }
    console.log(result.data)
    const coords = this.places.map(place => [place.latitude, place.longitude])
    console.log(coords)
    this.unoptimizedRoute = coords
  }

}
export const profileStore = new ProfileStore();