/* import { defineStore } from 'pinia' */

export const statusHeaderUpStore = defineStore('headerUp', {
    state: () => ({
        isActive: false,
    }),
    actions: {
        setIsActive(value: boolean) {
            this.isActive = value
        },
    },
})