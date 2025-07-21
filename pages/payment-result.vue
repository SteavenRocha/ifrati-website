<script setup>
import { useStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const id = route.query.id
const status = route.query.status

// MOSTRAR EL IMPACTO DE LA DONACION
const donationInfoParsed = ref(null)

onMounted(() => {
  const donationInfo = useStorage('donationInfo', null)

  if (donationInfo.value) {
    donationInfoParsed.value = JSON.parse(donationInfo.value)

    const purchaseNumber = transaction.value.purchaseNumber
    const emailSentKey = `emailSent_${purchaseNumber}`  // clave única por donación
    const emailSentFlag = useStorage(emailSentKey, false)

    if (status === 'Authorized' && transaction.value.donationType === 'GENERAL' && !emailSentFlag.value) {
      const donationType = transaction.value.donationType
      const transactionData = {
        email: transaction.value.email,
        name: transaction.value.name + ' ' + transaction.value.lastName,
        date: transaction.value.transactionDate,
        amount: transaction.value.amount,
        currency: transaction.value.currency,
        status: transaction.value.actionDescription,
        purchaseNumber,
        card: transaction.value.card,
        brand: transaction.value.brand,
        productDescription: transaction.value.productDescription
      }
      const impactData = {
        title: donationInfoParsed?.value?.impact || 'Donación personalizada',
        description: donationInfoParsed?.value?.description || 'Gracias por tu generosidad. Esta donación será destinada a nuestras causas principales.',
        sanitizedDetails: donationInfoParsed?.value?.sanitizedDetails || ''
      }

      submitDonationEmail(donationType, transactionData, impactData)
      emailSentFlag.value = true

    } else if (status === 'Authorized' && transaction.value.donationType === 'META' && !emailSentFlag.value) {
      const donationType = transaction.value.donationType
      const transactionData = {
        email: transaction.value.email,
        name: transaction.value.name + ' ' + transaction.value.lastName,
        date: transaction.value.transactionDate,
        amount: transaction.value.amount,
        currency: transaction.value.currency,
        status: transaction.value.actionDescription,
        purchaseNumber,
        card: transaction.value.card,
        brand: transaction.value.brand,
        productDescription: transaction.value.productDescription
      }
      const impactData = {
        title: donationInfoParsed?.value?.metaTitle,
        description: donationInfoParsed?.value?.metaDescription,
        goal: donationInfoParsed?.value.metaGoal,
        collected: donationInfoParsed?.value.metaCollected,
      }

      submitDonationEmail(donationType, transactionData, impactData)
      emailSentFlag.value = true
    }
  }
})

const { data: result, error } = await useAsyncData('paymentResult', async () => {
  const response = await $fetch('/api/getPaymentResult', {
    method: 'GET',
    params: { id }
  })

  console.log('✅ Datos recibidos:', response)
  return response
})

const button = {
  text: "Volver al inicio",
  style: "SECONDARY",
  href: config.public.nuxtApiUrl,
  iconUrl: `${config.public.strapiApiUrl}/uploads/heart_fill_696c0a5ae4.svg`
}

const getProgress = (collected, goal) => {
  if (!goal || goal === 0) return 0
  const total = collected || 0
  return Math.min(100, Math.round((total / goal) * 100))
}

const transaction = computed(() => {
  const t = result.value?.data?.[0] ?? {}

  return {
    actionDescription: t.actionDescription,
    address: t.address,
    goal: t.goal,
    amount: t.amount,
    brand: t.brand,
    card: t.card,
    city: t.city,
    country: t.country,
    currency: t.currency,
    documentNumber: t.documentNumber,
    documentType: t.documentType,
    donationType: t.donationType,
    email: t.email,
    frequency: t.frequency,
    id: t.id,
    lastName: t.lastName,
    name: t.name,
    phone: t.phone,
    postalCode: t.postalCode,
    productDescription: t.productDescription,
    purchaseNumber: t.purchaseNumber,
    state: t.state,
    transactionDate: t.transactionDate,
    transactionStatus: t.transactionStatus,
    type: t.type,
  }
})

const amount = Number(transaction.value.amount).toFixed(2)
const percentage = ref(0)
const percentageProgress = ref(0)

onMounted(() => {
  percentage.value = getProgress(transaction.value.goal?.totalCollected, donationInfoParsed.value.metaGoal);
  percentageProgress.value = getProgress(transaction.value.amount, donationInfoParsed.value.metaGoal);

  console.log(percentage.value, percentageProgress.value)
})

const formattedDate = computed(() => {
  const raw = transaction.value.transactionDate // "250718192144"
  if (!raw || raw.length !== 12) return 'Fecha inválida'

  const year = parseInt(raw.slice(0, 2), 10) + 2000
  const month = parseInt(raw.slice(2, 4), 10) - 1 // enero = 0
  const day = parseInt(raw.slice(4, 6), 10)
  const hour = raw.slice(6, 8)
  const minute = raw.slice(8, 10)

  const date = new Date(year, month, day, hour, minute)

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]

  return `${day} de ${meses[month]} del ${year}, ${hour}:${minute}`
})

async function submitDonationEmail(donationType, transactionData, impactData) {

  if (donationType === 'GENERAL') {
    const type = 'Donación General'

    const emailBody = {
      type,
      transactionData: transactionData,
      impactData: impactData
    };

    try {
      const response = await $fetch('/api/submitEmail?action=submitGeneralDonationEmail', {
        method: 'POST',
        body: emailBody,
      })

      if (response?.status === 'success') {
        console.log("correo enviado con exito", response)
      } else {
        console.log("error al envair correo", response)
      }
    } catch (error) {
      console.log("error al envair correo, error catch", response)
    }
  } else {
    const type = 'Donación Meta especifica'

    const emailBody = {
      type,
      transactionData: transactionData,
      impactData: impactData
    };

    try {
      const response = await $fetch('/api/submitEmail?action=submitGoalDonationEmail', {
        method: 'POST',
        body: emailBody,
      })

      if (response?.status === 'success') {
        console.log("correo enviado con exito", response)
      } else {
        console.log("error al envair correo", response)
      }
    } catch (error) {
      console.log("error al envair correo, error catch", response)
    }
  }
}
</script>

<template>
  <section>
    <div class="container__bg">
      <div v-if="status === 'Authorized'" class="content">
        <div class="header">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
            </svg>
          </div>
          <div class="header__content">
            <h1 class="title">¡Donación Exitosa!</h1>
            <p class="description">Tu donación ha sido procesada correctamente</p>
          </div>
        </div>
        <div class="wrapper">
          <div class="trasaction__content__bg">
            <div class="trasaction__content">
              <h3 class="content__title">
                <svg class="hash" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M5 9h14M5 15h14M11 4L7 20M17 4l-4 16" />
                </svg>
                Detalles de la Transacción
              </h3>
              <div class="content__body">
                <div class="row">
                  <div class="column">
                    <h4>Número de pedido</h4>
                    <p class="purchase__number">{{ transaction.purchaseNumber }}</p>
                  </div>
                  <div class="column">
                    <h4>Fecha y hora del pedido</h4>
                    <p>{{ formattedDate }}</p>
                  </div>
                </div>

                <div class="row">
                  <div class="column">
                    <h4>Donante</h4>
                    <p class="donor">{{ transaction.name }} {{ transaction.lastName }}</p>
                  </div>
                </div>

                <div class="row">
                  <div class="column">
                    <h4>Importe</h4>
                    <p class="amount">{{ amount }} {{ transaction.currency }} </p>
                  </div>
                  <div class="column">
                    <h4>Método de Pago</h4>
                    <p>{{ transaction.card }} <span class="brand">{{ transaction.brand }}</span></p>
                  </div>
                </div>

                <div class="row">
                  <div class="column">
                    <h4>Descripción del producto</h4>
                    <p>{{ transaction.productDescription }}</p>
                  </div>
                </div>
              </div>
            </div>

            <p class="disclamer">Recibirás un comprobante por email en los próximos minutos.</p>
          </div>

          <div class="donation__details"
            :class="{ 'donation__details__custom': donationInfoParsed?.donationType === 1 }">
            <h3 class="content__title">
              <svg class="heart" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
              </svg>
              Impacto de tu donación
            </h3>
            <div v-if="donationInfoParsed?.donationType === 0" class=" content__body">
              <div class="img">
                <img :src="donationInfoParsed?.img" alt="">
                <h3 class="impact__title">{{ donationInfoParsed?.impact }}</h3>
              </div>

              <div class="content__impact">
                <p class="detail">{{ donationInfoParsed?.description }}</p>

                <div class="detail__container">
                  <div v-for="(item, index) in donationInfoParsed?.sanitizedDetails" :key="index" class="detail">
                    <h4 class="item__detail">{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
                <div class="aditional__impact">
                  <h4 class="item__detail">{{ donationInfoParsed?.aditionalImpactTitle }}</h4>
                  <p>{{ donationInfoParsed?.aditionalImpactDescription }}</p>
                </div>
              </div>
            </div>

            <div v-else-if="donationInfoParsed?.donationType === 1" class="custom__donation">
              <h1 class="custom__title">Donación personalizada</h1>
              <p class="custom__description">Gracias por tu generosidad. Esta donación será destinada a nuestras
                causas principales.</p>
            </div>

            <div v-else class="content__body">
              <div class="img">
                <img :src="donationInfoParsed?.metaImg" alt="">
                <h3 class="impact__title">{{ donationInfoParsed?.metaTitle }}</h3>
              </div>

              <div class="content__meta">
                <p class="detail">{{ donationInfoParsed?.metaDescription }}</p>

                <div class="detail">
                  <h5>Progreso</h5>
                  <div class="progress__content">
                    <p class="progress">{{ percentage }}% completado</p>
                    <div class="collected__content">
                      <p class="collected__text">
                        {{ transaction.goal?.totalCollected || 0 }} S/. de
                      </p>
                      <p class="goal__text">
                        {{ donationInfoParsed?.metaGoal }} S/.
                      </p>
                    </div>
                  </div>
                  <div class="progress__bar">
                    <div class="progress__fill" :style="{ width: percentage + '%' }">
                    </div>
                    <!--  <div class="possible__amount" :style="{ width: percentage + percentageProgress + '%' }">
                    </div> -->
                  </div>
                </div>

                <div v-if="percentage !== 100" class="detail">
                  <h5>Tu contribución</h5>
                  <p>
                    Gracias a tu donacion de <strong>{{ amount }} {{ transaction?.currency }}</strong>
                    estamos un <strong>{{ percentageProgress }}%</strong> mas cerca
                    de nuestra meta.
                  </p>
                </div>

                <div v-else class="detail">
                  <h5>Tu contribución</h5>
                  <p>
                    Gracias a tu donacion de <strong>{{ amount }} {{ transaction?.currency }}</strong>
                    hemos logrado alcanzar el <strong>{{ percentage }}%</strong> de nuestra meta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button :text="button.text" :style="button.style" :href="button.href" :icon-url="button.iconUrl" />
      </div>

      <div v-else class="content">
        <div class="header">
          <div class="icon error">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0m-6-3l-6 6m0-6l6 6" />
            </svg>
          </div>
          <div class="header__content">
            <h1 class="title">Donación No Procesada</h1>
            <p class="description">No pudimos procesar tu donación en este momento</p>
          </div>
        </div>
        <div class="wrapper">
          <div class="trasaction__content__bg">
            <div class="trasaction__content__header">
              <p><strong class="error__strong">{{ transaction.transactionStatus }}:</strong> {{
                transaction.actionDescription }}</p>
            </div>
            <div class="trasaction__content">
              <h3 class="content__title">
                <svg class="hash" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M5 9h14M5 15h14M11 4L7 20M17 4l-4 16" />
                </svg>
                Detalles de la Transacción
              </h3>
              <div class="content__body">
                <div class="row">
                  <div class="column">
                    <h4>Número de pedido</h4>
                    <p class="purchase__number">{{ transaction.purchaseNumber }}</p>
                  </div>
                  <div class="column">
                    <h4>Fecha y hora del pedido</h4>
                    <p>{{ formattedDate }}</p>
                  </div>
                </div>

                <div class="row">
                  <div class="column">
                    <h4>Método de Pago</h4>
                    <p>{{ transaction.card }} <span class="brand">{{ transaction.brand }}</span></p>
                  </div>
                </div>

                <div class="row">
                  <div class="column">
                    <h4>Descripción del producto</h4>
                    <p>{{ transaction.productDescription }}</p>
                  </div>

                  <div class="column">
                    <h4>Descripción del error</h4>
                    <p>{{ transaction.actionDescription }}</p>
                  </div>
                </div>
              </div>
            </div>

            <p class="disclamer">No se realizó ningún cargo a tu tarjeta</p>
          </div>

          <div class="donation__details donation__details__custom__error">
            <h3 class="content__title">
              <svg class="heart" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                <g fill="none">
                  <path
                    d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path fill="currentColor"
                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 12a1 1 0 1 1 0 2a1 1 0 0 1 0-2m0-9.5a3.625 3.625 0 0 1 1.348 6.99a.8.8 0 0 0-.305.201c-.044.05-.051.114-.05.18L13 14a1 1 0 0 1-1.993.117L11 14v-.25c0-1.153.93-1.845 1.604-2.116a1.626 1.626 0 1 0-2.229-1.509a1 1 0 1 1-2 0A3.625 3.625 0 0 1 12 6.5" />
                </g>
              </svg>
              ¿Qué puedes hacer?
            </h3>

            <div class="custom__donation__error__container">
              <div class="custom__donation__error">
                <h1 class="custom__title">Sugerencias:</h1>
                <ul>
                  <li>Verifica el saldo de tu tarjeta o intenta con otro método de pago</li>
                  <li>Intenta con una tarjeta diferente</li>
                  <li>Verifica que todos los datos ingresados sean correctos</li>
                  <li>Contacta a tu banco si el problema persiste</li>
                  <li>Considera realizar la donación más tarde</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Button :text="button.text" :style="button.style" :href="button.href" :icon-url="button.iconUrl" />
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  height: auto;
  padding: var(--padding-section);
  padding-top: 180px;
}

.container__bg {
  background-color: rgb(255, 255, 255);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  max-width: var(--max-width);
  gap: 50px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.header__content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.icon {
  width: 70px;
  height: 70px;
  background: #DCFCE7;
  color: #16A34A;
  border-radius: 50%;
  padding: 10px;
}

.icon.error {
  background: #FEE2E2;
  color: #E13F3F;
}

.wrapper {
  display: flex;
  gap: 20px;
}

.title,
.description {
  text-align: center;
}

.title {
  color: var(--title-color);
  font-size: clamp(2rem, 3vw, 2.1rem);
}

.custom__title {
  color: var(--title-color);
  font-size: clamp(1rem, 3vw, 1.3rem);
  font-weight: 500;
}

.description {
  color: var(--text-color);
  font-size: clamp(1rem, 3vw, 1.1rem);
  line-height: 1.3;
}

.trasaction__content,
.donation__details {
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid rgba(185, 185, 185, 0.3);
  border-radius: 10px;
}

.trasaction__content__header {
  background-color: white;
  border: 1px solid rgba(185, 185, 185, 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.trasaction__content__bg {
  position: sticky;
  top: 130px;
  width: 55%;
  height: max-content;
}

.trasaction__content__bg.error {
  width: 700px;
}

.disclamer {
  font-size: .9rem;
  text-align: center;
  padding-top: 10px;
}

.donation__details {
  width: 45%;
}

.content__title {
  font-size: clamp(1.25rem, 3vw, 1.4rem);
  font-weight: 500;
  color: var(--title-color);
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 20px;
  border-bottom: 1px solid rgba(185, 185, 185, 0.3);
}

.content__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  height: 100%;
}

.row {
  display: flex;
  gap: 20px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

h4 {
  font-size: 1rem;
  color: #6B7280;
  font-weight: 400;
}

p {
  color: var(--text-color);
  line-height: 1.3;
}

.purchase__number {
  background-color: #F9FAFB;
  padding: 10px;
}

.donor {
  font-weight: 500;
}

.amount {
  color: var(--primary-color);
  font-weight: 700;
  font-size: 1.5rem;
}

.brand {
  border: 1px solid rgba(185, 185, 185, 0.3);
  padding: 2px 10px;
  border-radius: 15px;
  margin-left: 5px;
  font-size: .9rem;
  font-weight: 600;
}

.heart,
.hash {
  width: 20px;
  height: 20px;
}

.hash {
  color: var(--title-color);
}

.heart {
  color: red;
}

.content__impact,
.content__meta {
  background-color: #FCF0E9;
  padding: 20px;
  border-radius: 10px;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.img {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  height: 280px;
}

.img::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.35) 80%);
  pointer-events: none;
  z-index: 1;
}

.impact__title {
  position: absolute;
  bottom: 0;
  padding: 20px;
  color: white;
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 600;
  z-index: 2;
}

.detail__container {
  display: flex;
  gap: 10px;
}

.detail {
  background-color: #fff9f6;
  width: 100%;
  padding: 15px;
  border-radius: 10px;
}

.aditional__impact {
  background-color: #fff9f6;
  width: 100%;
  padding: 15px;
  border-radius: 10px;
}

.item__detail {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
}

.detail p,
.aditional__impact p {
  padding-top: 5px;
}

.custom__donation {
  background-color: #FCF0E9;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.custom__donation__error__container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.custom__donation__error {
  background-color: #F9FAFB;
  padding: 20px;
  border-radius: 10px;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.donation__details__custom__error {
  max-height: 387.19px;
}

.donation__details__custom {
  max-height: 379.58px;
}

.progress__content {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  color: var(--text-color);
}

.collected__content,
.progress,
.collected__text,
.goal__text {
  width: auto;
}

.collected__content {
  display: flex;
  gap: 5px;
}

.progress__bar {
  position: relative;
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 5px;
}

.progress__fill {
  position: absolute;
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease-in-out;
  z-index: 1;
}

strong {
  color: var(--primary-color);
}

.error__strong {
  color: var(--title-color);
}

li {
  color: var(--text-color);
  line-height: 1.3;
}

h5 {
  font-size: 1rem;
  font-weight: 500;
}

.status {
  background-color: #FEE2E2;
  padding: 20px;
  border: 1px solid #E13F3F;
  border-radius: 10px;
  margin-bottom: 20px;
}

/* .possible__amount {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(172, 128, 93, 0.815);
  transition: width 0.6s ease-in-out;
} */

@media (max-width: 1024px) {
  .wrapper {
    flex-direction: column;
    align-items: center;
  }

  .trasaction__content__bg {
    position: relative;
    width: 80%;
    top: 0;
  }

  .donation__details {
    width: 80%;
  }
}

@media (max-width: 640px) {

  .trasaction__content__bg,
  .donation__details {
    width: 100%;
  }
}

@media (max-width: 480px) {

  .row {
    flex-direction: column;
  }

  .content__meta,
  .custom__donation__error,
  .content__impact {
    padding: 10px;
  }

  .content__title,
  .content__body,
  .custom__donation__error__container {
    padding: 15px;
  }
}
</style>