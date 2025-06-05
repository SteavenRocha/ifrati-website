<script setup>
const props = defineProps({
    /* CONTACT DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pill: {
        type: Object,
        required: true,
    },
    contactCard: {
        type: Object,
        required: false,
    },
    contactInformation: {
        type: Object,
        required: false,
    },
    style: {
        type: Object,
        required: false,
    },
})

const companyInformation = inject('companyInformation')
if (!companyInformation) {
    console.warn('companyInformation no está disponible')
}

// FORMATEAR EL TITULO Y DESCRIPTION **
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

/* RECUPERAMOS STYLOS DE LA PILL */
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

/* STYLOS */
const bgColor = props.style?.backgroundColor ?? null
const titleColor = props.style?.titleColor ?? null
const textColor = props.style?.textColor ?? null

// ============ OBTENER SVG POR ÍTEM ============ //
// Obtener SVG plano para los contactLinks
const processedContactInformation = reactive([])

if (companyInformation?.information?.length) {
    for (const link of companyInformation.information) {
        const { svgHtml, loadSvg } = getSvgHtml()
        const iconUrl = getResource(link.resource?.url ?? '').imageUrl
        if (iconUrl) {
            await loadSvg(iconUrl)
        }
        processedContactInformation.push({
            ...link,
            svgHtml: svgHtml.value,
        })
    }
}

const form = reactive({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
})

const modalVisible = ref(false)
const modalMessage = ref('')
const modalType = ref('success') // 'success' o 'error'

function clearForm() {
    form.name = ''
    form.email = ''
    form.phone = ''
    form.subject = ''
    form.message = ''
    form.termsAccepted = false
}

/* POST PARA ENVIAR FORMULARIO */
async function handleSubmit() {
    try {
        const response = await $fetch('/api/sendForm?endpoint=inboxes', {
            method: 'POST',
            body: {
                name: form.name,
                email: form.email,
                phone: form.phone,
                subject: form.subject,
                message: form.message,
            },
        })

        if (response === 'success') {
            clearForm()
            modalMessage.value = '¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos pronto. ¡Esperamos poder ayudarte!'
            modalType.value = 'success'
            modalVisible.value = true
        }
    } catch (error) {
        clearForm()
        modalMessage.value = 'Error al enviar el mensaje, intentelo mas tarde'
        modalType.value = 'error'
        modalVisible.value = true
    }
}

const subjectData = await useApi('subjects')
const subjectList = subjectData?.data ?? []

watch(() => form.subject, (newSubject) => {
    const selected = subjectList.value.data.find((s) => s.title === newSubject)
    if (selected?.defaultMessage) {
        form.message = selected.defaultMessage
    } else {
        form.message = ''
    }
})
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-contact': bgColor ?? 'var(--background-color)',
        '--title-color-contact': titleColor ?? 'var(--title-color)',
        '--text-color-contact': textColor ?? 'var(--text-color)',
    }" id="contact">
        <div class="content">
            <div class="centered__texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p class="description" v-html="formattedDescription"></p>
            </div>

            <div class="contact__container">
                <div class="contact__frm__container">
                    <h1 class="sub__title">{{ contactCard.title }}</h1>

                    <form @submit.prevent="handleSubmit" class="contact__form">
                        <div class="form__group">
                            <label for="name">Nombres</label>
                            <input type="text" id="name" v-model="form.name" placeholder="Tu Nombre Completo"
                                required />
                        </div>

                        <div class="form__group">
                            <label for="email">Email</label>
                            <input type="email" id="email" v-model="form.email" placeholder="correo_example@gmail.com"
                                required />
                        </div>

                        <div class="form__group">
                            <label for="phone">Celular (Opcional)</label>
                            <input type="tel" id="phone" v-model="form.phone" placeholder="+51 987654321"
                                inputmode="numeric" pattern="[0-9]*"
                                @input="form.phone = form.phone.replace(/\D/g, '')" />
                        </div>

                        <div class="form__group">
                            <label for="subject">Asunto *</label>
                            <select v-model="form.subject" required :class="{ 'selected': form.subject !== '' }">
                                <option disabled value="">Selecciona un asunto</option>
                                <option v-for="subject in subjectList.data" :key="subject.id" :value="subject.title">
                                    {{ subject.title }}
                                </option>
                            </select>
                        </div>

                        <div class="form__group">
                            <label for="message">Mensaje</label>
                            <textarea id="message" rows="5" maxlength="4000" v-model="form.message"
                                placeholder="Detalla tu mensaje los mas posible" required></textarea>
                            <div class="char-counter">
                                {{ form.message.length }} / 4000 caracteres
                            </div>
                        </div>

                        <div class="form__group checkbox__group">
                            <label class="checkbox">
                                <input type="checkbox" v-model="form.termsAccepted" required />
                                <span>Acepto haber leído los <a href="/legal/Términos y condiciones"
                                        target="_blank">términos y condiciones</a></span>
                            </label>
                        </div>

                        <Button type="submit" :text="contactCard.button.text" :style="contactCard.button.style"
                            :icon-url="getResource(contactCard.button.icon?.url).imageUrl" />
                    </form>
                </div>

                <ModalMessage :visible="modalVisible" :message="modalMessage" :type="modalType"
                    @update:visible="modalVisible = $event" />

                <div class="contact__information__container">
                    <h1 class="sub__title">{{ contactInformation.text }}</h1>

                    <div class="information__container">
                        <div class="information" v-for="item in processedContactInformation" :key="item.id">
                            <span class="icon" v-if="item.svgHtml" v-html="item.svgHtml"></span>

                            <div class="details">
                                <h2 class="information__title">
                                    {{ item.title }}
                                </h2>
                                <p class="information__description" v-html="getTextFormated(item.description)"></p>
                            </div>
                        </div>
                    </div>

                    <div class="map" v-if="companyInformation.googleMapsLink">
                        <iframe :src="companyInformation.googleMapsLink" width="100%" height="450" style="border:0;"
                            allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
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
    background-color: var(--bg-color-contact);
    padding: var(--padding-section);
    scroll-margin-top: 100px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    max-width: var(--max-width);
    gap: 50px;
}

.pill__title {
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-contact);
}

.centered__texts .description {
    color: var(--text-color-contact);
}

.sub__title {
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: var(--title-color-contact);
}

.information__title {
    font-weight: 500;
    font-size: clamp(1.1rem, 3vw, 1.2rem);
    color: var(--title-color-contact);
}

.information__description {
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.3;
    color: var(--text-color-contact);
}

.contact__container {
    display: flex;
    gap: 50px;
}

.contact__information__container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.contact__frm__container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 50%;
}

.contact__information__container {
    width: 50%;
}

.information__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.information {
    display: flex;
    gap: 10px;
    align-items: start;
}

.details {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.icon {
    color: var(--primary-color);
    display: flex;
    align-items: start;
    width: 35px;
    height: 35px;
}

.map {
    width: 100%;
    height: 350px;
    border-radius: var(--border-radius);
    overflow: hidden;
}

.map iframe {
    width: 100%;
    height: 100%;
}

.contact__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

label {
    color: var(--text-color-contact);
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
    color: var(--text-color-contact);
}

input::placeholder,
textarea::placeholder {
    color: #888;
}

input:valid:not(:placeholder-shown),
textarea:valid:not(:placeholder-shown) {
    color: var(--text-color-contact);
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    border: 1px solid var(--primary-color);
}

textarea {
    resize: vertical;
}

.form__group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    width: max-content;
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

input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary-color);
    cursor: pointer;
}

.char-counter {
    text-align: right;
    font-size: 0.875rem;
    color: #666;
    margin-top: 4px;
}
</style>