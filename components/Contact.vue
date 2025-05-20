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

if (props.contactInformation?.information?.length) {
    for (const link of props.contactInformation.information) {
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

function handleSubmit() {
    console.log('Formulario enviado:', form)
    // Aquí puedes integrar la lógica para enviar los datos
}

</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-contact': bgColor ?? 'var(--background-color)',
        '--title-color-contact': titleColor ?? 'var(--title-color)',
        '--text-color-contact': textColor ?? 'var(--text-color)',
    }">
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
                            <label for="name">Nombre</label>
                            <input type="text" id="name" v-model="form.name" required />
                        </div>

                        <div class="form__group">
                            <label for="email">Email</label>
                            <input type="email" id="email" v-model="form.email" required />
                        </div>

                        <div class="form__group">
                            <label for="phone">Celular</label>
                            <input type="tel" id="phone" v-model="form.phone" required />
                        </div>

                        <div class="form__group">
                            <label for="subject">Asunto</label>
                            <input type="text" id="subject" v-model="form.subject" required />
                        </div>

                        <div class="form__group">
                            <label for="message">Mensaje</label>
                            <textarea id="message" rows="5" v-model="form.message" required></textarea>
                        </div>

                        <div class="form__group checkbox__group">
                            <label>
                                <input type="checkbox" v-model="form.termsAccepted" required />
                                Acepto haber leído los <a href="/terminos-y-condiciones" target="_blank">términos y
                                    condiciones</a>
                            </label>
                        </div>

                        <Button :key="contactCard.button.id" :text="contactCard.button.text"
                            :style="contactCard.button.style" :href="contactCard.button.href"
                            :icon-url="getResource(contactCard.button.icon?.url).imageUrl" />
                    </form>
                </div>

                <div class="contact__information__container">
                    <h1 class="sub__title">{{ contactInformation.title }}</h1>

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

                    <div class="map">
                        <iframe :src="contactInformation.googleMapsLink" width="100%" height="450" style="border:0;"
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
    scroll-margin-top: 40px;
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
</style>