<script setup>
/* OBTENER ESTADO DEL HEADER-UP */
const statusHeaderUp = statusHeaderUpStore()
const isActive = ref(false)

/* ICONS */
const { svgHtml: svgHtmlInf, loadSvg: loadSvgInf } = getSvgHtml()
const { svgHtml: svgHtmlImport, loadSvg: loadSvgImport } = getSvgHtml()

const companyInformation = inject('companyInformation')
if (!companyInformation) {
    console.warn('companyInformation no está disponible')
}

const { data } = await useApi('complaints-book')

const title = data?.value?.data?.header?.title ?? ''
const description = data?.value?.data?.header?.description ?? '' // DESCRIPTION
const pill = data?.value?.data?.header?.pill ?? {} // PILL

/* STYLOS */
const bgColor = data?.value?.data?.sectionStyle?.backgroundColor ?? null
const titleColor = data?.value?.data?.sectionStyle?.titleColor ?? null
const textColor = data?.value?.data?.sectionStyle?.textColor ?? null

// FORMATEAR EL TITULO Y DESCRIPTION **
const formattedTitle = ref(getTextFormated(title))
const formattedDescription = ref(getTextFormated(description))

/* RECUPERAMOS STYLOS DE LA PILL */
const bgColorPill = data?.value?.data?.header?.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = data?.value?.data?.header?.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

/* COMPANY INFORMATION */
const titleCompanyInf = data?.value?.data?.companyInformation?.title ?? ''
const iconPathInf = data?.value?.data?.companyInformation?.icon?.url ?? ''
const iconUrlInf = getResource(iconPathInf ?? '').imageUrl
/* ICON */
if (iconUrlInf) await loadSvgInf(iconUrlInf)

/* COMPANY INFORMATION - INFORMATION  */
const processedContactInformation = ref([])

if (companyInformation?.information?.length) {
    const temp = []

    for (const link of companyInformation.information) {
        const { svgHtml, loadSvg } = getSvgHtml()
        const iconUrl = getResource(link.resource?.url ?? '').imageUrl
        if (iconUrl) {
            await loadSvg(iconUrl)
        }
        temp.push({
            ...link,
            svgHtml: svgHtml.value,
        })
    }

    processedContactInformation.value = temp
}

const getInfoByTitleWithSvg = (title) =>
    processedContactInformation.value.find(
        (item) => item.title?.toLowerCase() === title.toLowerCase()
    )

const phoneInfo = getInfoByTitleWithSvg('Teléfono')
const emailInfo = getInfoByTitleWithSvg('Email')
const addressInfo = getInfoByTitleWithSvg('Dirección')
const scheduleInfo = getInfoByTitleWithSvg('Horario de atención')

/* STYLOS COMPANY INFORMATION */
const bgColorCompInf = data?.value?.data?.companyInformation?.style?.backgroundColor ?? null
const titleColorCompInf = data?.value?.data?.companyInformation?.style?.titleColor ?? null
const textColorCompInf = data?.value?.data?.companyInformation?.style?.textColor ?? null

/* COMPANY IMPORTANT */
const titleCompanyImport = data?.value?.data?.importantInformation?.title ?? ''
const iconPathImport = data?.value?.data?.importantInformation?.icon?.url ?? ''
const list = data?.value?.data?.importantInformation?.list ?? []
const iconUrlImport = getResource(iconPathImport ?? '').imageUrl
/* ICON */
if (iconUrlImport) await loadSvgImport(iconUrlImport)

/* STYLOS COMPANY IMPORTANT */
const bgColorCompImport = data?.value?.data?.importantInformation?.style?.backgroundColor ?? null
const titleColorCompImport = data?.value?.data?.importantInformation?.style?.titleColor ?? null
const textColorCompImport = data?.value?.data?.importantInformation?.style?.textColor ?? null

/* COMPANY FORM */
const titleCompanyform = data?.value?.data?.form?.title ?? ''
const descriptionCompanyform = data?.value?.data?.form?.description ?? ''
const titlesForm = data?.value?.data?.form?.titlesSectionForm ?? []
const button = data?.value?.data?.form?.button ?? {}

/* STYLOS COMPANY FORM */
const bgColorForm = data?.value?.data?.form?.style?.backgroundColor ?? null
const titleColorForm = data?.value?.data?.form?.style?.titleColor ?? null
const textColorForm = data?.value?.data?.form?.style?.textColor ?? null

const form = reactive({
    documentType: '',
    documentNumber: '',
    lastName: '',
    firstName: '',
    address: '',
    phone: '',
    email: '',
    productType: '',
    description: '',
    claimType: '',
    claimDetail: '',
    consumerRequest: '',
    /* form.termsAccepted = false */
})

const modalVisible = ref(false)
const modalMessage = ref('')
const modalType = ref('success') // 'success' o 'error'

function clearForm() {
    form.documentType = ''
    form.documentNumber = ''
    form.lastName = ''
    form.firstName = ''
    form.address = ''
    form.phone = ''
    form.email = ''
    form.productType = ''
    form.description = ''
    form.claimType = ''
    form.claimDetail = ''
    form.consumerRequest = ''
    form.termsAccepted = false
}

/* POST PARA ENVIAR FORMULARIO */
async function handleSubmit() {
    try {
        const response = await $fetch('/api/sendForm?endpoint=complaints-book-inboxes', {
            method: 'POST',
            body: {
                documentType: form.documentType,
                documentNumber: form.documentNumber,
                lastName: form.lastName,
                firstName: form.firstName,
                address: form.address,
                phone: form.phone,
                email: form.email,
                productType: form.productType,
                description: form.description,
                claimType: form.claimType,
                claimDetail: form.claimDetail,
                consumerRequest: form.consumerRequest,
                // termsAccepted: form.termsAccepted (si lo usas)
            },
        });

        if (response === 'success') {
            clearForm();
            modalMessage.value = '¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos pronto. ¡Esperamos poder ayudarte!';
            modalType.value = 'success';
            modalVisible.value = true;
        }
    } catch (error) {
        clearForm();
        modalMessage.value = 'Error al enviar el mensaje, inténtelo más tarde.';
        modalType.value = 'error';
        modalVisible.value = true;
        console.error("Error al enviar formulario:", error);
    }
}

isActive.value = statusHeaderUp.isActive
</script>

<template>
    <section :style="{
        '--header-height': isActive ? '110px' : '70px',
        paddingTop: 'var(--header-height)',
        '--bg-color-book': bgColor ?? 'var(--background-color)',
        '--title-color-book': titleColor ?? 'var(--title-color)',
        '--text-color-book': textColor ?? 'var(--text-color)'
    }">
        <div class="container">
            <div class="centered__texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p class="description" v-html="formattedDescription"></p>
            </div>
            <div class="cards__container">
                <div class="card information" :style="{
                    /* COLORES DE LA SECCION */
                    '--bg-color-compInf': bgColorCompInf ?? 'var(--background-color)',
                    '--title-color-compInf': titleColorCompInf ?? 'var(--title-color)',
                    '--text-color-compInf': textColorCompInf ?? 'var(--text-color)',
                }">
                    <div class="title__container">
                        <div class="icon information__icon">
                            <span v-if="svgHtmlInf" v-html="svgHtmlInf" />
                        </div>
                        <h1 class="title__information"> {{ titleCompanyInf }} </h1>
                    </div>
                    <div class="information__container">
                        <div class="left__information">
                            <div class="item">
                                <h2>RAZÓN SOCIAL</h2>
                                <p>{{ companyInformation?.companyName }}</p>
                            </div>
                            <div class="item">
                                <h2>RUC</h2>
                                <p>{{ companyInformation?.RUC }}</p>
                            </div>
                            <div class="item wicon" v-if="addressInfo">
                                <span class="tiny__icon" v-html="addressInfo.svgHtml"></span>
                                <div class="details">
                                    <h2>{{ addressInfo.title }}</h2>
                                    <p>{{ addressInfo.description }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="right__information">
                            <div class="item wicon" v-if="phoneInfo">
                                <span class="tiny__icon" v-html="phoneInfo.svgHtml"></span>
                                <div class="details">
                                    <h2>{{ phoneInfo.title }}</h2>
                                    <p>{{ phoneInfo.description }}</p>
                                </div>
                            </div>
                            <div class="item wicon" v-if="emailInfo">
                                <span class="tiny__icon" v-html="emailInfo.svgHtml"></span>
                                <div class="details">
                                    <h2>{{ emailInfo.title }}</h2>
                                    <p>{{ emailInfo.description }}</p>
                                </div>
                            </div>
                            <div class="item wicon" v-if="scheduleInfo">
                                <span class="tiny__icon" v-html="scheduleInfo.svgHtml"></span>
                                <div class="details">
                                    <h2>{{ scheduleInfo.title }}</h2>
                                    <p v-html="getTextFormated(scheduleInfo.description)"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card form" :style="{
                    /* COLORES DE LA SECCION */
                    '--bg-color-form': bgColorForm ?? 'var(--background-color)',
                    '--title-color-form': titleColorForm ?? 'var(--title-color)',
                    '--text-color-form': textColorForm ?? 'var(--text-color)',
                }">
                    <div class="title__container__form">
                        <h1 class="form__title"> {{ titleCompanyform }} </h1>
                        <p class="form__description"> {{ descriptionCompanyform }} </p>
                    </div>

                    <div class="form__container">
                        <form @submit.prevent="handleSubmit">
                            <!-- Datos del consumidor -->
                            <div class="form__section">
                                <h2 class="form__subtitle">{{ titlesForm[0].text }}</h2>

                                <!-- Campos personales -->
                                <div class="form__group half">
                                    <label for="documentType">Tipo de documento *</label>
                                    <select id="documentType" v-model="form.documentType" required
                                        :class="{ 'selected': form.documentType !== '' }">
                                        <option disabled value="">Seleccione</option>
                                        <option value="DNI">DNI</option>
                                        <option value="RUC">RUC</option>
                                    </select>
                                </div>

                                <div class="form__group half">
                                    <label for="documentNumber">Número de documento *</label>
                                    <input type="text" id="documentNumber" v-model="form.documentNumber"
                                        placeholder="Ingrese número" required inputmode="numeric" pattern="[0-9]*"
                                        @input="form.documentNumber = form.documentNumber.replace(/\D/g, '')" />
                                </div>

                                <div class="form__group half">
                                    <label for="lastName">Apellidos *</label>
                                    <input type="text" id="lastName" v-model="form.lastName"
                                        placeholder="Ingrese sus apellidos" required />
                                </div>

                                <div class="form__group half">
                                    <label for="firstName">Nombres *</label>
                                    <input type="text" id="firstName" v-model="form.firstName"
                                        placeholder="Ingrese sus nombres" required />
                                </div>

                                <div class="form__group">
                                    <label for="address">Dirección *</label>
                                    <input type="text" id="address" v-model="form.address"
                                        placeholder="Ingrese su dirección" required />
                                </div>

                                <div class="form__group half">
                                    <label for="phone">Celular *</label>
                                    <input type="tel" id="phone" v-model="form.phone"
                                        placeholder="Ingrese su número de celular" required inputmode="numeric"
                                        pattern="[0-9]*" @input="form.phone = form.phone.replace(/\D/g, '')" />
                                </div>

                                <div class="form__group half">
                                    <label for="email">Correo electrónico *</label>
                                    <input type="email" id="email" v-model="form.email"
                                        placeholder="Ingrese su correo electrónico" required />
                                </div>
                            </div>

                            <!-- Bien o servicio -->
                            <div class="form__section">
                                <h2 class="form__subtitle">{{ titlesForm[1].text }}</h2>

                                <div class="form__group">
                                    <div class="checkbox__group">
                                        <label class="checkbox">
                                            <input type="checkbox" value="Servicio" v-model="form.productType"
                                                @change="form.productType = 'Servicio'"
                                                :checked="form.productType === 'Servicio'" />
                                            Servicio (Relacionado al malestar o descontento respecto a la atención
                                            recibida.)
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox" value="Producto" v-model="form.productType"
                                                @change="form.productType = 'Producto'"
                                                :checked="form.productType === 'Producto'" />
                                            Producto (Relacionado a la compra de un bien, sustentado con comprobante de
                                            pago.)
                                        </label>
                                    </div>
                                </div>

                                <div class="form__group">
                                    <label for="description">Descripción *</label>
                                    <textarea id="description" v-model="form.description" maxlength="4000"
                                        placeholder="Describa el bien o servicio" required></textarea>
                                    <div class="char-counter">
                                        {{ form.description.length }} / 4000 caracteres
                                    </div>
                                </div>
                            </div>

                            <!-- Reclamo o queja -->
                            <div class="form__section">
                                <h2 class="form__subtitle">{{ titlesForm[2].text }}</h2>

                                <div class="form__group">
                                    <div class="checkbox__group">
                                        <label class="checkbox">
                                            <input type="checkbox" value="Reclamo" v-model="form.claimType"
                                                @change="form.claimType = 'Reclamo'"
                                                :checked="form.claimType === 'Reclamo'" />
                                            Reclamo
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox" value="Queja" v-model="form.claimType"
                                                @change="form.claimType = 'Queja'"
                                                :checked="form.claimType === 'Queja'" />
                                            Queja
                                        </label>
                                    </div>
                                </div>

                                <div class="form__group">
                                    <label for="claimDetail">Detalle del reclamo o queja *</label>
                                    <textarea id="claimDetail" v-model="form.claimDetail" maxlength="4000"
                                        placeholder="Describa detalladamente su reclamo o queja" required></textarea>
                                    <div class="char-counter">
                                        {{ form.claimDetail.length }} / 4000 caracteres
                                    </div>
                                </div>

                                <div class="form__group">
                                    <label for="consumerRequest">Pedido del consumidor *</label>
                                    <textarea id="consumerRequest" v-model="form.consumerRequest" maxlength="4000"
                                        placeholder="Indique qué solución espera por su reclamo" required></textarea>
                                    <div class="char-counter">
                                        {{ form.consumerRequest.length }} / 4000 caracteres
                                    </div>
                                </div>
                            </div>

                            <div class="form__group checkbox__group">
                                <label class="checkbox">
                                    <input type="checkbox" v-model="form.termsAccepted" required />
                                    <span>Acepto haber leído los <a href="/legal/Términos y condiciones"
                                            target="_blank">términos y condiciones</a></span>
                                </label>
                            </div>

                            <Button type="submit" :text="button.text" :style="button.style"
                                :icon-url="getResource(button.icon?.url).imageUrl" />
                        </form>
                    </div>
                </div>

                <ModalMessage :visible="modalVisible" :message="modalMessage" :type="modalType"
                    @update:visible="modalVisible = $event" />

                <div class="card important" :style="{
                    /* COLORES DE LA SECCION */
                    '--bg-color-compImport': bgColorCompImport ?? 'var(--background-color)',
                    '--title-color-compImport': titleColorCompImport ?? 'var(--title-color)',
                    '--text-color-compImport': textColorCompImport ?? 'var(--text-color)',
                }">
                    <div class="title__container">
                        <div class="icon important__icon">
                            <span v-if="svgHtmlImport" v-html="svgHtmlImport" />
                        </div>
                        <h1 class="title__important"> {{ titleCompanyImport }} </h1>
                    </div>
                    <div class="important__container">
                        <ul>
                            <li v-for="item in list" :key="item.id">
                                {{ item.text }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-book);
    padding: var(--padding-section);
    scroll-margin-top: 40px;
}

.container {
    display: flex;
    margin: auto;
    flex-direction: column;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.centered__texts {
    padding-top: 100px;
}

.centered__texts .title {
    color: var(--title-color-book);
}

.centered__texts .description {
    color: var(--text-color-book);
}

.pill__title {
    align-items: center;
}

.title__container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.title__container__form {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
}

.icon {
    width: 30px;
    height: 30px;
}

.icon.information__icon {
    color: var(--title-color-compInf);
}

.icon.important__icon {
    color: var(--title-color-compImport);
}

.tiny__icon {
    width: 25px;
    height: 25px;
    color: var(--title-color-compInf);
}

.cards__container {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.card {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1000px;
    margin: auto;
}

.card.information {
    background-color: var(--bg-color-compInf);
}

.card.important {
    background-color: var(--bg-color-compImport);
}

.card.form {
    background-color: var(--bg-color-form);
    gap: 30px;
}

.title__information {
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: var(--title-color-compInf);
}

.title__important {
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: var(--title-color-compImport);
}

.form__title {
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
}

.form__title,
.form__subtitle {
    color: var(--title-color-form);
}

.form__description {
    color: var(--text-color-form);
}

.form__subtitle {
    grid-column: span 2;
    font-weight: 500;
    font-size: clamp(1.2rem, 3vw, 1.25rem);
}

.information__container {
    display: flex;
    gap: 20px;
}

.left__information,
.right__information {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.item {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.item.wicon {
    flex-direction: row;
}

.details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.information__container h2 {
    font-weight: 450;
    font-size: 0.9rem;
    text-transform: uppercase;
    color: var(--text-color-compInf);
}

.information__container p {
    font-weight: 450;
    color: var(--title-color-compInf);
}

.important__container ul {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.important__container ul li {
    color: var(--text-color-compImport);
}

.form__container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

label {
    color: var(--text-color-form);
}

input,
textarea,
select {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;
    color: #888;
}

select.selected {
    color: var(--text-color-form);
}

input::placeholder,
textarea::placeholder {
    color: #888;
}

input:valid:not(:placeholder-shown),
textarea:valid:not(:placeholder-shown) {
    color: var(--text-color-form);
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    border: 1px solid var(--primary-color);
}

textarea {
    resize: vertical;
    height: 120px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.form__section {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
}

.form__group {
    display: flex;
    gap: 5px;
    flex-direction: column;
}

.form__group.half {
    grid-column: span 1;
}

.form__group:not(.half) {
    grid-column: span 2;
}

.checkbox__group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    width: 100%;
}

.checkbox input {
    width: auto;
    cursor: pointer;
}

input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary-color);
}

.checkbox span,
.checkbox a {
    font-size: 0.9rem;
    color: var(--text-color-contact);
}

.checkbox a {
    color: var(--primary-color);
}

.checkbox a:hover {
    filter: brightness(90%);
}

.char-counter {
    text-align: right;
    font-size: 0.875rem;
    color: #666;
    margin-top: 4px;
}
</style>