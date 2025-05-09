// store/sliderStore.js
export const positionSliderStore = defineStore('slider', {
  state: () => ({
    position: 0, 
  }),
  actions: {
    setPosition(newPosition: number) {
      this.position = newPosition
    },
  },
})
