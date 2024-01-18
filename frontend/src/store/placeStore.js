// import _ from "lodash";
import { makeAutoObservable, runInAction } from "mobx";
import { api, methods } from "../helpers";
import { authStore } from "./authStore";


class PlaceStore {
  places = []
  cities = []
  districts = []
  place_types = []
  onePlace = {}

  constructor() {
    makeAutoObservable(this);
  }

  async getInitialCitiesDistrictsPlaceTypes() {
    let result = await api('cities', methods.GET, null, authStore.token);
    this.cities = result.data;
    result = await api('districts', methods.GET, null, authStore.token);
    this.districts = result.data;
    result = await api('place_types', methods.GET, null, authStore.token);
    this.place_types = result.data;
    console.log(result)
  }

  async getPlaces() {
    console.log("bitch")
    const result = await api('places', methods.GET, null, authStore.token);
    runInAction(() => {
      this.places = result.data;
    })
    // this.places = result.data;
    console.log(this.places)
    for (const place of this.places) {
      console.log(place.images[0])
      if (place.images[0]) {
        const img = await api(`places/image?file_name=${place.images[0].path}`, methods.GET, null, authStore.token, {'Content-Type': 'image/png'})
        console.log(img)
        const path = URL.createObjectURL(img.data)
        place.imageURL = path
      }
    }
  }

  async getPlaceByAlias(alias) {
    const result = await api(`places/get_by_alias`, methods.POST, JSON.stringify({alias: alias}), authStore.token)
    runInAction(() => {
      this.onePlace = result.data;
    })
    // this.places = result.data;
    // console.log(this.places)
    this.onePlace.imageURLs = []
    for (const image of this.onePlace.images) {
      const img = await api(`places/image?file_name=${image.path}`, methods.GET, null, authStore.token, {'Content-Type': 'image/png'})
      console.log(img)
      const path = URL.createObjectURL(img.data)
      this.onePlace.imageURLs.push(path)
      console.log(path)
    }
  }

  async createPlace(data, images) {
    const res = await api('places', methods.POST, JSON.stringify(data), authStore.token);
    // await this.getPlaces();
    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      console.log(formData)

      await api('places/upload_image', methods.POST, formData, authStore.token, {});
    }
    return res
  }

  async addOrRemoveFromRoute(id) {
    const places_json = localStorage.getItem('route_cart')
    let places = []
    if (places_json) {
      places = JSON.parse(places_json)
    }
		if (places.includes(id)) {
			places.splice(places.indexOf(id), 1)
      // toast({title: 'Место удалено из маршрута', status: 'success'})
		}
		else {
			places.push(id)
      // toast({title: 'Место добавлено в маршрут', status: 'success'})
		}
    localStorage.setItem("route_cart", JSON.stringify(places))
  }

  isInRouteCart(id) {
    const places_json = localStorage.getItem('route_cart')
    let places = []
    if (places_json) {
      places = JSON.parse(places_json)
    }
    // console.log(places.includes(id))
    // console.log(places.includes(id) ? 'Remove from route' : 'Add to route')
    return places.includes(id)
  }
}

export const placeStore = new PlaceStore();