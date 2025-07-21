<script setup>
const config = useRuntimeConfig()
import { departments } from '@/utils/departments'
import { useStorage } from '@vueuse/core'

useHead({
    link: [
        {
            rel: 'stylesheet',
            href: config.public.niubizUrlCss
        }
    ],
    script: [
        {
            src: config.public.niubizUrlJs,
            defer: true
        }
    ],
})

const props = defineProps({
    /* DONATE DATA */
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
    donationForm: {
        type: Object,
        required: true,
    },
    goalsForm: {
        type: Object,
        required: true,
    },
    volunteerForm: {
        type: Object,
        required: true,
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

/* STYLOS FORM */
const bgColorForm = props.donationForm?.formStyle?.backgroundColor ?? null
const titleColorForm = props.donationForm?.formStyle?.titleColor ?? null
const textColorForm = props.donationForm?.formStyle?.textColor ?? null

/* CTA STYLES */
const bgColorCta = props.goalsForm?.cta?.ctaStyle?.backgroundColor ?? null
const titleColorCta = props.goalsForm?.cta?.ctaStyle?.titleColor ?? null
const textColorCta = props.goalsForm?.cta?.ctaStyle?.textColor ?? null

// ESTADOS
const activeTab = ref('general') // 'general' o 'specific'
const selectedAmountId = ref(props.donationForm.donationDetails[0]?.id)
const selectedFrequency = ref('mensual')
const otherAmount = ref('')

// Computed para obtener el amount seleccionado
const selectedDonation = computed(() =>
    props.donationForm.donationDetails.find(d => d.id === selectedAmountId.value)
)

// Computed para obtener el monto final
const selectedAmount = computed(() => {
    if (otherAmount.value !== '') {
        const parsed = parseFloat(otherAmount.value)
        return isNaN(parsed) ? 0 : parsed
    }
    const selected = props.donationForm.donationDetails.find(d => d.id === selectedAmountId.value)
    return selected?.amount || 0
})

const svgHtmlMap = reactive({})
const cards = props.donationForm.donationDetails.flatMap(detail => detail.detailsCard || [])

for (const detail of cards) {
    const url = getResource(detail.resource?.url).imageUrl
    if (url) {
        const { svgHtml, loadSvg } = getSvgHtml()
        await loadSvg(url)
        svgHtmlMap[detail.id] = svgHtml.value
    }
}

/* SLIDER */
// TODAS LAS METAS CON ESTADO TRUE
const dataGoals = await useApi('goals?sort[0]=title:asc&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText')
const goals = dataGoals?.data ?? []
/* OBTNER CANTIDAD DE CARDS ACTIVAS */
const activeCardsCount = goals.value.data.length
/* OBTNER CANTIDAD DE CARDS VISIBLES */
const visibleCards = ref(3)

function updateVisibleCards() {
    const width = window.innerWidth
    if (width < 800) {
        visibleCards.value = 1
    } else if (width < 1024) {
        visibleCards.value = 2
    } else {
        visibleCards.value = 3
    }
}

onMounted(() => {
    updateVisibleCards()
    window.addEventListener('resize', updateVisibleCards)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateVisibleCards)
})

//

function daysRemaining(deadline) {
    const today = new Date()
    const endDate = new Date(deadline)
    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? `${diffDays} días restantes` : 'Fecha vencida'
}

const getProgress = (collected, goal) => {
    if (!goal || goal === 0) return 0
    const total = collected || 0
    return Math.min(100, Math.round((total / goal) * 100))
}

/* const newGetProgress = (donationAmount, goal) => {
    if (!goal || goal === 0) return 0
    return (donationAmount / goalgoalAmount) * 100
} */

/* CARD STYLES */
const bgColorCard = props.goalsForm?.cardStyle?.backgroundColor ?? null
const titleColorCard = props.goalsForm?.cardStyle?.titleColor ?? null
const textColorCard = props.goalsForm?.cardStyle?.textColor ?? null

/* MODALES */
/* MODAL PARA PEDIR DATOS */
const donationType = ref(null) // 'general' o 'meta'
const productDescription = ref(null)
const showModal = ref(false);
const firstInputRef = ref(null);
const step = ref('form');
/* META SELECCIONADA */
const selectedGoal = ref(null);
const firstTermsAccepted = ref(false) // PARA LOS TERMINOS DE LOS PRIMEROS FORMULARIOS TANTO GENERAL COMO ESPECIFICO
const percentage = ref(null);
const percentageProgress = ref(null);

watch(showModal, async (newVal) => {
    document.body.style.overflow = newVal ? 'hidden' : ''

    if (otherAmount.value) {
        selectedAmountId.value = null
    }

    if (newVal) {
        if (donationType.value === 'general') {
            selectedGoal.value = null
            productDescription.value = 'DONACIÓN SOLIDARIA'
            await nextTick()
            firstInputRef.value?.focus()
        } else if (donationType.value === 'meta') {
            step.value = 'amount'
            productDescription.value = 'META ESPECÍFICA'
            otherAmount.value = ''
            percentage.value = getProgress(selectedGoal.value.totalCollected, selectedGoal.value.goal)
            percentageProgress.value = getProgress(selectedAmount.value, selectedGoal.value.goal)

            watch(otherAmount, (newVal) => {
                if (newVal !== '' && selectedGoal.value && selectedGoal.value.goal) {
                    selectedAmountId.value = props.donationForm.donationDetails[0]?.id
                    percentageProgress.value = getProgress(selectedAmount.value, selectedGoal.value.goal)
                }
            })

            watch(selectedDonation, (newVal) => {
                if (newVal !== '' && selectedGoal.value && selectedGoal.value.goal) {
                    percentageProgress.value = getProgress(selectedAmount.value, selectedGoal.value.goal)
                }
            })
        }
    } else {
        clearForm()
        clearDataMapform()
        step.value = 'form'
        selectedGoal.value = null
        donationType.value = null
        selectedAmountId.value = props.donationForm.donationDetails[0]?.id
        otherAmount.value = ''
        firstTermsAccepted.value = false
        productDescription.value = null
    }
})

const form = reactive({
    documentType: 'DNI',
    documentNumber: '',
    name: '',
    lastName: '',
    email: '',
    phone: ''
})

const dataMapform = reactive({
    country: 'PE',
    city: '',
    address: '',
    postal: '',
    department: ''
})

/* const cardForm = reactive({
    cardNumber: '',
    expirationDate: '',
    cvv: '' 
})*/

function clearForm() {
    form.documentNumber = ''
    form.name = ''
    form.lastName = ''
    form.email = ''
    form.phone = ''
}

function clearDataMapform() {
    dataMapform.city = '',
        dataMapform.address = '',
        dataMapform.postal = '',
        dataMapform.department = ''
}

const handleContinue = async (type) => {
    switch (type) {
        case 'form':
            clearForm()
            step.value = 'form'
            await nextTick()
            firstInputRef.value?.focus()
            break
        case 'dataMap':
            /*clearForm() */
            step.value = 'dataMap';
            break
        case 'pay':
            step.value = 'pay';
            await nextTick()
            await submitSessionInfo()
            await initPayform()
            break
        case 'review':
            /* LOADER - HASTA QUE SE PROCESE EL PAGO */
            showModal.value = false;
            isLoading.value = true;
            await pay();
            break;
        default:
            console.warn('Tipo no reconocido en handleContinue:', type)
    }
}

// FUNCION PARA ABRIR LOS FORMUALRIOS RESPECTIVOS, CON LOS TERMINOS ACEPTADOS
function handleDonationSubmit(donationFormType) {
    if (donationFormType === 'general') {
        donationType.value = 'general'
        showModal.value = true
    } else {
        handleContinue('form')
    }
}

// NIUBIZ
// OBTENER DATOS POR DNI
watch(() => form.documentNumber, async (newDocumentNumber) => {
    if (newDocumentNumber.length === 8) {
        try {
            const response = await $fetch('/api/getDataDni', {
                method: 'GET',
                params: { dni: newDocumentNumber }
            })

            if (response?.nombres || response?.apellidoPaterno || response?.apellidoMaterno) {
                form.name = response.nombres
                form.lastName = response.apellidoPaterno + ' ' + response.apellidoMaterno
            }

        } catch (e) {
            console.error('Error en la petición de DNI:', e)
        }
    }
})

// DONACION - REVIEW
/* const amount = Number(selectedAmount.value).toFixed(2) */
const loading = ref(true)
let purchaseNumber = ''

async function submitSessionInfo() {
    try {
        loading.value = true
        const amount = Number(selectedAmount.value).toFixed(2)

        const response = await $fetch('/api/getSessionInfo', {
            method: 'POST',
            body: {
                amount: amount,
                mdd: {
                    email: form.email,
                    dni: form.documentNumber,
                    type: 'Invitado',
                    days: '1',
                },
                cardDataMap: {
                    city: dataMapform.city,
                    country: dataMapform.country,
                    address: dataMapform.address,
                    postalCode: dataMapform.postal,
                    state: dataMapform.department,
                    phoneNumber: form.phone
                }
            }
        })

        if (response && !response.error) {

            purchaseNumber = response.purchaseNumber // ASIGNAR PURCHARSENUMBER

            const configuration = {
                callbackurl: `${config.public.nuxtApiUrl}/api/paymentResult?id=${purchaseNumber}`,
                sessionkey: response.sessionKey,
                channel: response.channel,
                merchantid: response.merchantId,
                purchasenumber: purchaseNumber,
                amount: response.amount,
                language: 'es',
                font: 'https://fonts.googleapis.com/css?family=Montserrat:400&display=swap',
                // recurrencemaxamount: '8.5'
            }

            console.log(configuration)

            payform.setConfiguration(configuration)

        } else {
            console.warn('Respuesta no valida:', response)
        }

    } catch (error) {
        console.error('Error al enviar:', error)
    }
}

/* watch([() => step.value, () => loading.value], async ([stepNow, loadingNow]) => {
    if (stepNow === 'pay' && loadingNow === false) {
        await nextTick()

        // Verifica otra vez los elementos
        const ready =
            document.getElementById('txtNumeroTarjeta') &&
            document.getElementById('txtFechaVencimiento') &&
            document.getElementById('txtCvv')

        if (!ready) {
            console.warn('Intentando inicializar Payform, pero el DOM aún no está listo.')
            return
        }

        initPayform()
    }
}) */

/* const credito = ref(false) */

/* REFRESCAR LA PAGINA */
const router = useRouter()

function handleClose() {

    showModal.value = false;

    if (step.value === "pay") {
        router.go(0)
    }
}

/* VARIABLES GLOBALES DE LOS CAMPOS DE LA CARD */
let cardNumber
let cardExpiry
let cardCvv

async function initPayform() {
    /*     resetPayform() // ELIMINAR PENDIENTE */
    var elementStyles = {
        base: {
            color: 'black',
            fontWeight: 500,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            placeholder: {
                color: '#888',
            },
            autofill: {
                color: '#e39f48',
            },
        },
        invalid: {
            color: '#E25950',
            '::placeholder': {
                color: '#FFCCA5',
            },
        },
    };

    const tarjeta = document.getElementById('txtNumeroTarjeta')
    const fecha = document.getElementById('txtFechaVencimiento')
    const cvv = document.getElementById('txtCvv')

    if (!tarjeta || !fecha || !cvv) {
        console.error('Contenedores de campos de tarjeta no están presentes en el DOM aún.')
        return
    }

    cardNumber = payform.createElement('card-number', {
        style: elementStyles,
        placeholder: 'Número de Tarjeta'
    }, 'txtNumeroTarjeta')

    cardExpiry = payform.createElement('card-expiry', {
        style: elementStyles,
        placeholder: 'MM / YY'
    }, 'txtFechaVencimiento')

    cardCvv = payform.createElement('card-cvc', {
        style: elementStyles,
        placeholder: 'CVC'
    }, 'txtCvv')

    cardNumber.then(element => {
        // BIN
        element.on('bin', data => {
            console.log('BIN:', data)
        })

        element.on('lastFourDigits', (data) => {
            console.log('lastFourDigits:', data)
        })

        // DCC
        /*  element.on('dcc', data => {
             if (data) {
                 const confirmText = `Usted tiene la opción de pagar su factura en: PEN ${amount.value} o ${data.currencyCodeAlpha} ${data.amount}...
                                     Tasa de cambio: ${data.exchangeRate}
                                     MARGEN FX: ${data.markup}`
 
                 dcc.value = confirm(confirmText)
             }
        }) */

        // INSTALLMENTS
        /*  element.on('installments', (data) => {
             const cuotasContainer = document.getElementById('cuotas')
 
             if (data && channel === 'web' && cuotasContainer) {
                 credito.value = true
                 cuotasContainer.style.display = 'block'
 
                 if (!document.getElementById('selectCuotas')) {
                     const select = document.createElement('select')
                     select.id = 'selectCuotas'
 
                     const optionDefault = document.createElement('option')
                     optionDefault.value = optionDefault.textContent = 'Sin cuotas'
                     select.appendChild(optionDefault)
 
                     data.forEach((item) => {
                         const option = document.createElement('option')
                         option.value = option.textContent = item
                         select.appendChild(option)
                     })
 
                     cuotasContainer.appendChild(select)
                 }
             } else {
                 credito.value = false
                 const cuotas = document.getElementById('selectCuotas')
                 if (cuotas && cuotas.parentNode) {
                     cuotas.parentNode.removeChild(cuotas)
                 }
                 cuotasContainer.style.display = 'none'
             }
         }) */

        // CHANGE
        element.on('change', data => {
            const msjNro = document.getElementById('msjNroTarjeta')
            const msjFec = document.getElementById('msjFechaVencimiento')
            const msjCvv = document.getElementById('msjCvv')

            if (msjNro) msjNro.style.display = 'none'
            if (msjFec) msjFec.style.display = 'none'
            if (msjCvv) msjCvv.style.display = 'none'

            data?.forEach((d) => {
                if (d.code === 'invalid_number' && msjNro) {
                    msjNro.style.display = 'block'
                    msjNro.innerText = d.message
                }
                if (d.code === 'invalid_expiry' && msjFec) {
                    msjFec.style.display = 'block'
                    msjFec.innerText = d.message
                }
                if (d.code === 'invalid_cvc' && msjCvv) {
                    msjCvv.style.display = 'block'
                    msjCvv.innerText = d.message
                }
            })
        })
    })

    /* cardCvv.then(element => {
        element.on('change', function (data) {
            console.log('CHANGE CVV2: ', data);
        })
    });

    cardExpiry.then(element => {
        element.on('change', function (data) {
            console.log('CHANGE F.V: ', data);
        })
    }); */

    /* await waitForConsoleMessage('Finished') */
    loading.value = false
}

/* function waitForConsoleMessage(targetMessage = 'Finished') {
    return new Promise((resolve) => {
        const originalLog = console.log

        console.log = function (...args) {
            // Detecta el mensaje "Finished"
            if (args.length > 0 && typeof args[0] === 'string' && args[0].includes(targetMessage)) {
                console.log = originalLog // restaurar console.log
                resolve(args)
            }
            // Sigue ejecutando el console.log original
            originalLog.apply(console, args)
        }
    })
} */

/* function resetPayform() {
    const tarjeta = document.getElementById('txtNumeroTarjeta')
    const fecha = document.getElementById('txtFechaVencimiento')
    const cvv = document.getElementById('txtCvv')

    if (tarjeta) tarjeta.innerHTML = ''
    if (fecha) fecha.innerHTML = ''
    if (cvv) cvv.innerHTML = ''

    window.cardNumber = null
    window.cardExpiry = null
    window.cardCvc = null
} */

/* LOADER PARA DONACIONES Y ENVIO DE EMAIL */
const isLoading = ref(false)

/* ************************* */
/* // OPCION SIN CALLBACKURL */
/* ************************* */
/* async function pay() {
    // Validación de elementos de tarjeta
    if (!cardNumber || !cardExpiry || !cardCvv) {
        console.error('❌ Campos de tarjeta no están definidos');
        return false;
    }

    // Datos del titular de tarjeta
    const data = {
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phone,
        installment: 1,
        alias: 'DONACIONWEB'
    };

    return new Promise((resolve) => {
        payform.createToken(
            [cardNumber, cardExpiry, cardCvv],
            data
        ).then(async (tokenResponse) => {
            if (!tokenResponse) {
                console.warn('⚠️ Token no generado:', tokenResponse);
                resolve(false);
                return;
            }

            console.log('✅ Token generado:', tokenResponse);
            console.log('✅ purcharseNumber:', purchaseNumber);

            // Obtener autorización
            try {
                const amount = Number(selectedAmount.value).toFixed(2);

                const response = await $fetch('/api/getAuthorization', {
                    method: 'POST',
                    body: {
                        amount: amount,
                        purchaseNumber: purchaseNumber,
                        tokenId: tokenResponse.transactionToken,
                        locationDataMap: {
                            urlAddress: "https://ifrati.org.pe",
                            city: dataMapform.city,
                            state: dataMapform.department,
                            country: dataMapform.country,
                            postalCode: dataMapform.postal,
                        }
                    },
                });

                if (response && !response.error) {

                    console.log('✅ Autorización obtenida:', response);

                    isLoading.value = false;

                    //const transactionData = {
                    //    state: response.authorization.dataMap.ACTION_DESCRIPTION,
                    //    number: response.authorization.order.purchaseNumber,
                    //    card: response.authorization.dataMap.CARD,
                    //}

                    //await submitDonationEmail(transactionData);

                    resolve(true);
                } else {
                    console.warn('⚠️ Respuesta inválida al autorizar:', response.details);
                    isLoading.value = false;
                    resolve(false);
                }

            } catch (authError) {
                console.error('❌ Error al obtener autorización:', authError);
                resolve(false);
            }

        }).catch((tokenError) => {
            console.error('❌ Error al generar token:', tokenError);
            resolve(false);
        });
    });
} */

// USO DEL LOCALSTORAGE PARA ALMACENAR DATOS DE LA DONACION
const theDefault = {
    donationType: null,
    img: null,
    impact: null,
    description: null,
    sanitizedDetails: null,
    aditionalImpactTitle: null,
    aditionalImpactDescription: null,
    metaTitle: null,
    metaDescription: null,
    metaImg: null,
    metaProgress: null,
    metaCollected: null,
    metaGoal: null
}

const donationInfo = useStorage('donationInfo', theDefault)
/* donationInfo.value = null */

/* ************************* */
/* // OPCION CON CALLBACKURL */
/* ************************* */
async function pay() {
    // Validación de elementos de tarjeta
    if (!cardNumber || !cardExpiry || !cardCvv) {
        console.error('❌ Campos de tarjeta no están definidos');
        return false;
    }

    // Datos del titular de tarjeta
    const data = {
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phone,
        installment: 1,
        alias: 'DONACIONWEB'
    };

    try {
        // Esta función ya redirige automáticamente si configuraste callbackurl
        payform.createToken(
            [cardNumber, cardExpiry, cardCvv],
            data
        );

        submitDonation()

        if (donationType.value === 'general') {
            if (selectedDonation.value && !otherAmount.value) {
                // ENVIA DATOS DEL IMPACTO POR EL LOCALSTORAGE
                const sanitizedDetails = selectedDonation.value.detailsCard.map(item => ({
                    title: item.title,
                    description: item.description
                }));

                donationInfo.value = {
                    donationType: 0,
                    img: getResource(selectedDonation.value.impact.resource?.url).imageUrl,
                    impact: selectedDonation.value.impact.title,
                    description: selectedDonation.value.impact.description,
                    sanitizedDetails: sanitizedDetails,
                    aditionalImpactTitle: selectedDonation.value.aditionalImpact.title,
                    aditionalImpactDescription: selectedDonation.value.aditionalImpact.description,
                }
            } else {
                donationInfo.value = {
                    donationType: 1,
                    img: null,
                    impact: null,
                    description: null,
                    sanitizedDetails: null,
                    aditionalImpactTitle: null,
                    aditionalImpactDescription: null,
                }
            }
        } else {
            donationInfo.value = {
                donationType: 2,
                img: null,
                impact: null,
                description: null,
                sanitizedDetails: null,
                aditionalImpactTitle: null,
                aditionalImpactDescription: null,
                customDonation: null,
                metaTitle: selectedGoal.value.title,
                metaDescription: selectedGoal.value.description,
                metaImg: getResource(selectedGoal.value.image?.url).imageUrl,
                metaProgress: getProgress(selectedGoal.value.totalCollected, selectedGoal.value.goal),
                metaCollected: selectedGoal.value.totalCollected,
                metaGoal: selectedGoal.value.goal,
            }
        }
        // Puedes mostrar un loader o algo mientras redirige
        /* isLoading.value = true; */

    } catch (tokenError) {
        console.error('❌ Error al generar token:', tokenError);
        isLoading.value = false;
    }
}

async function submitDonation() {
    try {
        const response = await $fetch('/api/sendForm?endpoint=donations', {
            method: 'POST',
            body: {
                transactionStatus: null,
                purchaseNumber: purchaseNumber,
                productDescription: productDescription.value,
                donationType: donationType.value.toUpperCase(),
                frequency: 'UNICA',
                type: 'Invitado',
                documentType: form.documentType,
                documentNumber: form.documentNumber,
                name: form.name,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                goal: selectedGoal.value ? selectedGoal.value.documentId : null,
                amount: selectedAmount.value,
                currency: 'PEN',
                country: dataMapform.country,
                state: dataMapform.department,
                city: dataMapform.city,
                address: dataMapform.address,
                postalCode: dataMapform.postal,
                card: null,
                brand: null,
                transactionDate: null,
                actionDescription: null
            },
        })

        if (response === 'success' && !response.error) {
            console.log("donacion registrada:", response)
        }

        /* if (response === 'success' && selectedGoal.value) {

            const newTotalCollected = selectedAmount.value + selectedGoal.value.totalCollected
            const id = selectedGoal.value.documentId
            try {
                const response = await $fetch(`/api/sendForm?endpoint=goals/${id}`, {
                    method: 'PUT',
                    body: {
                        totalCollected: newTotalCollected,
                    },
                })
                if (response === 'success') {
                    
                }
            } catch (error) {
                
            }
        } else {

        } */
    } catch (error) {
        console.error('Error al enviar:', error)
    }
}

/* VOLUNTARIADO */
/* CARD STYLES */
const bgColorCardV = props.volunteerForm?.cardStyle?.backgroundColor ?? null
const titleColorCardV = props.volunteerForm?.cardStyle?.titleColor ?? null
const textColorCardV = props.volunteerForm?.cardStyle?.textColor ?? null
/* STYLOS FORM */
const bgColorFormV = props.volunteerForm?.formStyle?.backgroundColor ?? null
const titleColorFormV = props.volunteerForm?.formStyle?.titleColor ?? null
const textColorFormV = props.volunteerForm?.formStyle?.textColor ?? null

const firstInputRefVolunteer = ref(null);

const volunteerForm_ = reactive({
    documentType: 'DNI',
    documentNumber: '',
    name: '',
    email: '',
    phone: '',
    type: '',
    availability: '',
    experience: '',
    motivation: '',
    termsAccepted: false,
})

function clearVolunteerForm() {
    volunteerForm_.documentNumber = ''
    volunteerForm_.name = ''
    volunteerForm_.email = ''
    volunteerForm_.phone = ''
    volunteerForm_.type = ''
    volunteerForm_.availability = ''
    volunteerForm_.experience = ''
    volunteerForm_.motivation = ''
    volunteerForm_.termsAccepted = false
}

watch(() => volunteerForm_.documentNumber, async (newDocumentNumber) => {
    if (newDocumentNumber.length === 8) {
        try {
            const response = await $fetch('/api/getDataDni', {
                method: 'GET',
                params: { dni: newDocumentNumber }
            })

            if (response?.nombreCompleto) {
                volunteerForm_.name = response.nombreCompleto
            }

        } catch (e) {
            console.error('Error en la petición de DNI (volunteer):', e)
        }
    }
})

watch(activeTab, async (newVal) => {
    if (newVal === 'volunteer') {
        await nextTick()
        firstInputRefVolunteer.value?.focus()
    } else {
        clearVolunteerForm()
        selectedAmountId.value = props.donationForm.donationDetails[0]?.id
    }
})

/* MODAL DE SUCCESS / ERROR */
const modalVisible = ref(false)
const modalEmail = ref('')
const modalType = ref('success')
/* const isLoading = ref(false) */

/* POST PARA ENVIAR FORMULARIO */
async function handleSubmit() {
    const documentType = volunteerForm_.documentType
    const documentNumber = volunteerForm_.documentNumber
    const name = volunteerForm_.name
    const email = volunteerForm_.email
    const phone = volunteerForm_.phone
    const type = volunteerForm_.type
    const availability = volunteerForm_.availability
    const experience = volunteerForm_.experience
    const motivation = volunteerForm_.motivation

    try {
        const response = await $fetch('/api/sendForm?endpoint=volunteer-inboxes', {
            method: 'POST',
            body: {
                documentType: documentType,
                documentNumber: documentNumber,
                name: name,
                email: email,
                phone: phone,
                type: type,
                availability: availability,
                experience: experience,
                motivation: motivation
            },
        })

        if (response === 'success') {
            isLoading.value = true

            const volunteerBody = {
                documentType: documentType,
                documentNumber: documentNumber,
                name: name,
                email: email,
                phone: phone,
                type: type,
                availability: availability,
                experience: experience,
                motivation: motivation
            };

            try {
                const response = await $fetch('/api/submitEmail?action=submitVolunteerEmail', {
                    method: 'POST',
                    body: volunteerBody
                })

                if (response.status === 'success') {
                    clearVolunteerForm()
                    modalEmail.value = email
                    modalType.value = 'success'
                } else {
                    modalType.value = 'error'
                }
            } catch (error) {
                clearVolunteerForm()
                modalType.value = 'error'
            } finally {
                isLoading.value = false // desactivar loading
                modalVisible.value = true // mostrar modal
            }
        }
    } catch (error) {
        clearVolunteerForm()
        modalType.value = 'error'
        modalVisible.value = true
    }
}
</script>

<template>
    <section :style="{
        '--bg-color-donate': bgColor ?? 'var(--background-color)',
        '--title-color-donate': titleColor ?? 'var(--title-color)',
        '--text-color-donate': textColor ?? 'var(--text-color)',
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

            <div class="form__container" :style="{
                '--bg-color-form': bgColorForm ?? 'var(--background-color)',
                '--title-color-form': titleColorForm ?? 'var(--title-color)',
                '--text-color-form': textColorForm ?? 'var(--text-color)',
            }">
                <div class="type">
                    <h1 class="item" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
                        {{ donationForm.selectedTitle }}
                    </h1>
                    <h1 class="item" :class="{ active: activeTab === 'specific' }" @click="activeTab = 'specific'">
                        {{ goalsForm.selectedTitle }}
                    </h1>
                    <h1 class="item" :class="{ active: activeTab === 'volunteer' }" @click="activeTab = 'volunteer'">
                        {{ volunteerForm.selectedTitle }}
                    </h1>
                </div>

                <div class="general__donation" v-if="activeTab === 'general'">
                    <div class="amount__frm">
                        <div class="amount__content">
                            <h1 class="title__amount">{{ donationForm.title }}</h1>
                            <div class="container__frm">
                                <div class="amount__container" v-for="amount in donationForm?.donationDetails"
                                    :key="amount.id"
                                    :class="{ selected: selectedAmountId === amount.id && otherAmount === '' }"
                                    @click="() => { selectedAmountId = amount.id; otherAmount = '' }">
                                    <div class="amount">{{ amount.amount }}PEN</div>
                                </div>
                            </div>
                            <div class="another__amount">
                                <div class="input-wrapper">
                                    <input type="number" placeholder="PEN Otra cantidad" v-model="otherAmount" />
                                </div>
                            </div>
                            <div class="frequency">
                                <button :class="{ active: selectedFrequency === 'mensual' }"
                                    @click="selectedFrequency = 'mensual'">
                                    Mensual
                                </button>
                                <button :class="{ active: selectedFrequency === 'unica' }"
                                    @click="selectedFrequency = 'unica'">
                                    Única
                                </button>
                            </div>
                        </div>

                        <form @submit.prevent="handleDonationSubmit(activeTab)">
                            <div class="button__container">
                                <div class="form__group checkbox__group">
                                    <label class="checkbox terms">
                                        <input type="checkbox" required v-model="firstTermsAccepted" />
                                        <span>
                                            Acepto haber leído los
                                            <a href="/legal/Términos y condiciones" target="_blank">términos y
                                                <br />condiciones</a>
                                        </span>
                                    </label>
                                </div>
                                <button type="submit">Donar</button>
                                <p class="button__text">Tu donación es deducible fiscalmente</p>
                            </div>
                        </form>
                    </div>

                    <!-- Mostrar mensaje personalizado si hay un monto personalizado -->
                    <div v-if="otherAmount !== ''" class="impact__frm">
                        <h1 class="title__impact">Donación personalizada</h1>
                        <p class="description">Gracias por tu generosidad. Esta donación será destinada a nuestras
                            causas principales.</p>
                    </div>

                    <!-- Mostrar impacto solo si se seleccionó un amount fijo -->
                    <div class="impact__frm" v-else-if="selectedDonation">
                        <h1 class="title__impact">{{ donationForm.secondTitle }}</h1>
                        <div class="impact__container">
                            <div class="image">
                                <img :src="getResource(selectedDonation.impact.resource?.url).imageUrl" alt="">
                                <h1 class="image__title">{{ selectedDonation.impact.title }}</h1>
                            </div>
                            <p class="description">{{ selectedDonation.impact.description }}</p>

                            <div class="details__cards">
                                <div v-for="(detail, index) in selectedDonation.detailsCard" :key="detail.id"
                                    class="details__card">
                                    <div class="title__card">
                                        <div class="icon">
                                            <span v-if="svgHtmlMap[detail.id]" v-html="svgHtmlMap[detail.id]" />
                                        </div>
                                        <h3 class="details__card__title">{{ detail.title }}</h3>
                                    </div>
                                    <p class="details__card__description">{{ detail.description }}</p>
                                </div>
                            </div>

                            <div class="aditional__impact">
                                <h1 class="aditional__title">{{ selectedDonation.aditionalImpact.title }}</h1>
                                <p class="aditional__description">{{ selectedDonation.aditionalImpact.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="specific_goals" v-if="activeTab === 'specific'" :style="{
                    '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                    '--title-color-card': titleColorCard ?? 'var(--title-color)',
                    '--text-color-card': textColorCard ?? 'var(--text-color)',
                }">
                    <h1 class="title__goals">
                        {{ goalsForm.title }}
                    </h1>

                    <Slider id="goalsSlider" :totalCards=activeCardsCount :visibleCards=visibleCards>
                        <div class="card__section" v-for="(item, index) in goals.data" :key="index">
                            <div class="goal__image">
                                <img :src="getResource(item.image?.url).imageUrl" alt="">
                                <h2 class="deadline">
                                    {{ daysRemaining(item.deadline) }}
                                </h2>
                            </div>
                            <div class="card__content">
                                <div class="card__texts">
                                    <h1 class="card__title">
                                        {{ item.title }}
                                    </h1>
                                    <p class="card__description">
                                        {{ item.description }}
                                    </p>
                                </div>
                                <div class="progress__container">
                                    <div class="progress__content">
                                        <p class="progress">{{ getProgress(item.totalCollected, item.goal) }}%
                                            completado</p>
                                        <div class="collected__content">
                                            <p class="collected__text">
                                                {{ item.totalCollected || 0 }} S/. de
                                            </p>
                                            <p class="goal__text">
                                                {{ item.goal }} S/.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="progress__bar">
                                        <div class="progress__fill"
                                            :style="{ width: getProgress(item.totalCollected, item.goal) + '%' }"></div>
                                    </div>
                                </div>
                                <button class="goal__button"
                                    @click="donationType = 'meta'; showModal = true; selectedGoal = item">
                                    Donar a esta meta
                                </button>
                            </div>
                        </div>
                    </Slider>

                    <div class="cta" :style="{
                        '--bg-color-cta': bgColorCta ?? 'var(--background-color)',
                        '--title-color-cta': titleColorCta ?? 'var(--title-color)',
                        '--text-color-cta': textColorCta ?? 'var(--text-color)',
                    }">
                        <h1 class="cta__title">
                            {{ goalsForm.cta?.title }}
                        </h1>
                        <p class="cta__description">
                            {{ goalsForm.cta?.description }}
                        </p>
                    </div>
                </div>

                <div class="volunteer__section" v-if="activeTab === 'volunteer'">
                    <div class="volunteer">
                        <h3 class="first__title">{{ volunteerForm.firstTitle }}</h3>
                        <div class="card__container" :style="{
                            '--bg-color-cardV': bgColorCardV ?? 'var(--background-color)',
                            '--title-color-cardV': titleColorCardV ?? 'var(--title-color)',
                            '--text-color-cardV': textColorCardV ?? 'var(--text-color)',
                        }">
                            <div class="card" v-for="(item, index) in volunteerForm.card" :key="index">
                                <div class="card__icon">
                                    <img :src="getResource(item.icon?.url).imageUrl" alt="">
                                </div>
                                <div class="card__content__volunteer">
                                    <div class="card__header">
                                        <h3 class="card__title__volunteer">{{ item.title }}</h3>
                                        <p class="card__description__volunteer">{{ item.description }}</p>
                                    </div>
                                    <div class="card__container__characteristic">
                                        <div class="card__characteristics" v-for="charct in item?.characteristics">
                                            <h4>{{ charct.title }}</h4>
                                            <p>{{ charct.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form" :style="{
                        '--bg-color-formV': bgColorFormV ?? 'var(--background-color)',
                        '--title-color-formV': titleColorFormV ?? 'var(--title-color)',
                        '--text-color-formV': textColorFormV ?? 'var(--text-color)',
                    }">
                        <h3 class="first__title">{{ volunteerForm.form?.title }}</h3>

                        <form @submit.prevent="handleSubmit">
                            <div class="data__form">
                                <div class="form__row">
                                    <div class="form__group">
                                        <label for="documentType">Tipo de Documento</label>
                                        <select id="documentType" v-model="volunteerForm_.documentType" required
                                            disabled>
                                            <option value="DNI">DNI</option>
                                        </select>
                                    </div>

                                    <div class="form__group">
                                        <label for="documentNumber">Número de Documento</label>
                                        <input type="text" id="documentNumber" v-model="volunteerForm_.documentNumber"
                                            ref="firstInputRefVolunteer" placeholder="12345678" required
                                            inputmode="numeric" pattern="[0-9]*"
                                            @input="volunteerForm_.documentNumber = volunteerForm_.documentNumber.replace(/\D/g, '')" />
                                    </div>
                                </div>

                                <div class="form__group">
                                    <label for="name">Nombre</label>
                                    <input type="text" id="name" v-model="volunteerForm_.name"
                                        placeholder="Nombre Completo" required disabled />
                                </div>

                                <div class="form__group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" v-model="volunteerForm_.email"
                                        placeholder="correo_example@gmail.com" required />
                                </div>

                                <div class="form__group">
                                    <label for="phone">Celular</label>
                                    <input type="tel" id="phone" v-model="volunteerForm_.phone" class="volunteer__form"
                                        placeholder="+51 987654321" inputmode="numeric" pattern="[0-9]*"
                                        @input="volunteerForm_.phone = volunteerForm_.phone.replace(/\D/g, '')" />
                                </div>

                                <div class="form__group">
                                    <label for="type">Voluntariado</label>
                                    <select v-model="volunteerForm_.type" required
                                        :class="{ 'selected': volunteerForm_.type !== '' }">
                                        <option disabled value="">Selecciona un Voluntariado</option>
                                        <option v-for="volunteer in volunteerForm.card" :key="volunteer.id"
                                            :value="volunteer.title">
                                            {{ volunteer.title }}
                                        </option>
                                    </select>
                                </div>

                                <div class="form__group">
                                    <label for="availability">Disponibilidad</label>
                                    <select v-model="volunteerForm_.availability" required
                                        :class="{ 'selected': volunteerForm_.availability !== '' }">
                                        <option disabled value="">Selecciona tu Disponibilidad</option>
                                        <option value="2-4 horas semanales">2-4 horas semanales</option>
                                        <option value="4-8 horas semanales">4-8 horas semanales</option>
                                        <option value="Mas de 8 horas semanales">Mas de 8 horas semanales</option>
                                    </select>
                                </div>

                                <div class="form__group">
                                    <label for="experience">Experiencia</label>
                                    <textarea id="experience" rows="5" maxlength="4000"
                                        v-model="volunteerForm_.experience"
                                        placeholder="Cuentanos sobre tu experiencia relevante para el voluntariado"
                                        required></textarea>
                                    <div class="char-counter">
                                        {{ volunteerForm_.experience.length }} / 4000 caracteres
                                    </div>
                                </div>

                                <div class="form__group">
                                    <label for="motivation">Motivacion</label>
                                    <textarea id="motivation" rows="5" maxlength="4000"
                                        v-model="volunteerForm_.motivation"
                                        placeholder="¿Por qué quieres ser voluntario/a en Ifrati" required></textarea>
                                    <div class="char-counter">
                                        {{ volunteerForm_.motivation.length }} / 4000 caracteres
                                    </div>
                                </div>
                            </div>

                            <div class="button__container__volunteer">
                                <div class="form__group checkbox__group">
                                    <label class="checkbox">
                                        <input type="checkbox" v-model="volunteerForm_.termsAccepted" required />
                                        <span>Acepto haber leído los <a href="/legal/Términos y condiciones"
                                                target="_blank">términos y <br> condiciones</a></span>
                                    </label>
                                </div>
                                <Button type="submit" :text="volunteerForm.form.button.text"
                                    :style="volunteerForm.form.button.style"
                                    :icon-url="getResource(volunteerForm.form.button.icon?.url).imageUrl"
                                    extraClass="full__width" />
                            </div>
                        </form>
                    </div>
                </div>

                <ModalMessage :visible="modalVisible" :email="modalEmail" :type="modalType"
                    @update:visible="modalVisible = $event" />
            </div>
        </div>

        <Loader :visible="isLoading" />

        <!-- SECCION DE MODALES -->
        <!-- Modal para pedir datos -->
        <div v-show="showModal" class="modal" :style="{
            '--bg-color-form': bgColorForm ?? 'var(--background-color)',
            '--title-color-form': titleColorForm ?? 'var(--title-color)',
            '--text-color-form': textColorForm ?? 'var(--text-color)',
        }">
            <span class="close" @click="handleClose"><svg xmlns="http://www.w3.org/2000/svg" width="118.64" height="128"
                    viewBox="0 0 1216 1312">
                    <path fill="currentColor"
                        d="M1202 1066q0 40-28 68l-136 136q-28 28-68 28t-68-28L608 976l-294 294q-28 28-68 28t-68-28L42 1134q-28-28-28-68t28-68l294-294L42 410q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294l294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68L880 704l294 294q28 28 28 68" />
                </svg></span>

            <div class="modal__content">
                <!-- Contenido del impacto -->
                <div v-if="donationType === 'general' && selectedDonation">
                    <div class="image">
                        <img :src="getResource(selectedDonation.impact.resource?.url).imageUrl" alt="Impacto" />
                        <h2 class="image__title">{{ selectedDonation.impact.title }}</h2>
                    </div>
                </div>

                <div v-if="donationType === 'meta' && selectedGoal">
                    <div class="image">
                        <img :src="getResource(selectedGoal.image?.url).imageUrl" alt="Impacto" />

                        <div class="overlay__goal__details">
                            <div class="goal__details__container">
                                <h2 class="image__title__goal">{{ selectedGoal.title }}</h2>

                                <div class="progress__container">
                                    <div class="progress__content">
                                        <p class="progress">{{ getProgress(selectedGoal.totalCollected,
                                            selectedGoal.goal)
                                        }}%
                                            completado</p>
                                        <div class="collected__content">
                                            <p class="collected__text">
                                                {{ selectedGoal.totalCollected || 0 }} S/. de
                                            </p>
                                            <p class="goal__text">
                                                {{ selectedGoal.goal }} S/.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="progress__bar">
                                        <div class="progress__fill" :style="{ width: percentage + '%' }">
                                        </div>
                                        <div class="possible__amount"
                                            :style="{ width: percentage + percentageProgress + '%' }">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="otherAmount !== '' && donationType === 'general'" class="personalized">
                    <h1 class="title__impact">Donación personalizada</h1>
                    <p class="description">Gracias por tu generosidad. Esta donación será destinada a nuestras
                        causas principales.</p>
                </div>

                <div v-if="step === 'amount' && selectedGoal" class="get__amount__goal">
                    <div class="amount__frm">
                        <div class="amount__content">
                            <h1 class="title__amount">{{ donationForm.title }}</h1>
                            <div class="container__frm">
                                <div class="amount__container" v-for="amount in donationForm?.donationDetails"
                                    :key="amount.id"
                                    :class="{ selected: selectedAmountId === amount.id && otherAmount === '' }"
                                    @click="() => { selectedAmountId = amount.id; otherAmount = '' }">
                                    <div class="amount">{{ amount.amount }}PEN</div>
                                </div>
                            </div>
                            <div class="another__amount">
                                <div class="input-wrapper">
                                    <input type="number" placeholder="PEN Otra cantidad" v-model="otherAmount" />
                                </div>
                            </div>
                            <div class="frequency">
                                <button :class="{ active: selectedFrequency === 'mensual' }"
                                    @click="selectedFrequency = 'mensual'">
                                    Mensual
                                </button>
                                <button :class="{ active: selectedFrequency === 'unica' }"
                                    @click="selectedFrequency = 'unica'">
                                    Única
                                </button>
                            </div>
                        </div>

                        <form @submit.prevent="handleDonationSubmit(activeTab)">
                            <div class="button__container">
                                <div class="form__group checkbox__group">
                                    <label class="checkbox terms">
                                        <input type="checkbox" required v-model="firstTermsAccepted" />
                                        <span>
                                            Acepto haber leído los
                                            <a href="/legal/Términos y condiciones" target="_blank">términos y
                                                <br />condiciones</a>
                                        </span>
                                    </label>
                                </div>

                                <div class="button__container__modal">
                                    <button class="modal__button cancel" type="button"
                                        @click="showModal = false">Cancelar</button>
                                    <button class="modal__button" type="submit">Continuar</button>
                                </div>
                                <p class="button__text">Tu donación es deducible fiscalmente</p>
                            </div>
                        </form>
                        <!--  <div class="button__container">
                            <button @click="handleContinue('form')">Donar</button>
                            <p class="button__text">Tu donación es deducible fiscalmente</p>
                        </div> -->
                    </div>
                </div>

                <div v-if="step === 'form'" class="get__data__container">
                    <h1 class="title__modal">Información de facturación</h1>

                    <form @submit.prevent="handleContinue('dataMap')">
                        <div class="data__form">
                            <div class="form__row">
                                <div class="form__group">
                                    <label for="documentType">Tipo de Documento</label>
                                    <select id="documentType" v-model="form.documentType" required disabled>
                                        <option value="DNI">DNI</option>
                                    </select>
                                </div>

                                <div class="form__group">
                                    <label for="documentNumber">Número de Documento</label>
                                    <input type="text" id="documentNumber" v-model="form.documentNumber"
                                        ref="firstInputRef" placeholder="12345678" required inputmode="numeric"
                                        pattern="[0-9]*" maxlength="8" minlength="8"
                                        @input="form.documentNumber = form.documentNumber.replace(/\D/g, '')" />
                                </div>
                            </div>

                            <div class="form__row">
                                <div class="form__group">
                                    <label for="name">Nombres</label>
                                    <input type="text" id="name" v-model="form.name" placeholder="Nombre Completo"
                                        required disabled />
                                </div>

                                <div class="form__group">
                                    <label for="lastName">Apellidos</label>
                                    <input type="text" id="lastName" v-model="form.lastName" placeholder="Apellidos"
                                        required disabled />
                                </div>
                            </div>

                            <div class="form__group">
                                <label for="email">Email</label>
                                <input type="email" id="email" v-model="form.email"
                                    placeholder="correo_example@gmail.com" required />
                            </div>

                            <div class="form__group">
                                <label for="phone">Celular</label>
                                <div class="phone__input__wrapper">
                                    <span class="phone__prefix">+51</span>
                                    <input type="tel" id="phone" v-model="form.phone" placeholder="987654321"
                                        class="phone" inputmode="numeric" pattern="[0-9]*" required maxlength="9"
                                        minlength="9" @input="form.phone = form.phone.replace(/\D/g, '')" />
                                </div>
                            </div>
                        </div>

                        <div class="button__container__modal">
                            <button class="modal__button cancel" type="button"
                                @click="showModal = false">Cancelar</button>
                            <button class="modal__button" type="submit">Continuar</button>
                        </div>
                    </form>
                </div>

                <div v-if="step === 'dataMap'" class="get__data__container">
                    <h1 class="title__modal">Información de facturación</h1>

                    <form @submit.prevent="handleContinue('pay')">
                        <div class="data__form">
                            <div class="form__row">
                                <div class="form__group">
                                    <label for="country">País</label>
                                    <select id="country" v-model="dataMapform.country" required disabled>
                                        <option value="PE">PERÚ</option>
                                    </select>
                                </div>

                                <div class="form__group">
                                    <label for="department">Departamento</label>
                                    <select v-model="dataMapform.department" id="department" required>
                                        <option value="">Selecciona un departamento</option>
                                        <option v-for="d in departments" :key="d.code" :value="d.code">
                                            {{ d.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="form__row">
                                <div class="form__group">
                                    <label for="city">Distrito / Ciudad</label>
                                    <input type="text" id="city" v-model="dataMapform.city"
                                        placeholder="Ingresa tu distrito / ciudad" required />
                                </div>

                                <div class="form__group">
                                    <label for="postal">Codigo postal</label>
                                    <input type="text" id="postal" v-model="dataMapform.postal"
                                        placeholder="Ingresa tu codigo postal" required />
                                </div>
                            </div>

                            <div class="form__group">
                                <label for="address">Dirección</label>
                                <input type="text" id="address" v-model="dataMapform.address"
                                    placeholder="Ingresa tu dirección" required />
                            </div>

                        </div>

                        <div class="button__container__modal">
                            <button class="modal__button cancel" type="button"
                                @click="showModal = false">Cancelar</button>
                            <button class="modal__button" type="submit">Continuar</button>
                        </div>
                    </form>
                </div>

                <div v-show="step === 'pay'">

                    <div v-if="loading" class="loader__container">
                        <Loader :visible="loading" customStyle="form__style" />
                    </div>

                    <div v-show="!loading" class="get__data__container">
                        <h1 class="title__modal">Datos de la tarjeta</h1>

                        <form @submit.prevent="handleContinue('review')">
                            <div class="data__form">
                                <!-- <div class="form__group">
                                <label for="cardNumber">Número de Tarjeta</label>
                                <input type="text" id="cardNumber" v-model="cardForm.cardNumber"
                                    placeholder="1234 5678 9012 3456" inputmode="numeric" pattern="[0-9\s]*" required />
                            </div>

                            <div class="form__group">
                                <label for="expirationDate">Fecha de Vencimiento</label>
                                <input type="text" id="expirationDate" v-model="cardForm.expirationDate"
                                    placeholder="MM/AA" pattern="(0[1-9]|1[0-2])\/\d{2}" required />
                            </div>

                            <div class="form__group">
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" v-model="cardForm.cvv" placeholder="123" maxlength="4"
                                    inputmode="numeric" pattern="\d{3,4}" required />
                            </div> -->
                                <div class="row">
                                    <div id="txtNumeroTarjeta"></div>
                                    <small id="msjNroTarjeta"></small>
                                </div>

                                <div class="content__card__data">
                                    <div class="row">
                                        <div id="txtFechaVencimiento"></div>
                                        <small id="msjFechaVencimiento"></small>
                                    </div>
                                    <div class="row">
                                        <div id="txtCvv"></div>
                                        <small id="msjCvv"></small>
                                    </div>
                                </div>

                                <!--  <div id="cuotas" style="display: none;"></div> -->

                            </div>

                            <div class="button__container__modal">
                                <button class="modal__button cancel" type="button"
                                    @click="handleClose">Cancelar</button>
                                <button class="modal__button" type="submit">Continuar</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Paso 3: Vista con revisión de datos -->
                <!-- <div v-else-if="step === 'review'" class="get__data__container">
                    {{ selectedFrequency }}
                    <p>Monto seleccionado: S/ {{ selectedAmount.toFixed(2) }}</p>
                    <h1 class="title__modal">Completar donación</h1>
                    <p><strong>Nombre:</strong> {{ form.name }}</p>
                    <p><strong>Email:</strong> {{ form.email }}</p>
                    <p><strong>Celular:</strong> {{ form.phone }}</p>
                    <button class="modal__button" @click="submitDonation">Donar</button>
                </div> -->
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-donate);
    padding: var(--padding-section);
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    margin: auto;
    flex-direction: column;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.pill__title {
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-donate);
}

.centered__texts .description {
    color: var(--text-color-donate);
}

.type {
    display: flex;
    gap: 20px;
}

.item {
    width: auto;
    cursor: pointer;
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 400;
    padding-bottom: 15px;
    transition: all .3s ease;
    border-bottom: 2px solid transparent;
    color: gray;
}

.item.active {
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
}

.form__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid rgba(185, 185, 185, 0.3);
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: var(--bg-color-form);
}

.general__donation {
    display: flex;
    gap: 40px;
    min-height: 620px;
}

.title__amount,
.title__impact {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 500;
    color: var(--title-color-form);
}

.title__goals {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 500;
    color: var(--title-color-form);
}

.amount__frm {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 50%;
    border: 1px solid rgba(185, 185, 185, 0.3);
    padding: 30px;
    gap: 20px;
    border-radius: var(--border-radius);
}

.amount__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.impact__frm {
    width: 50%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #F9FAFB;
    border-radius: 20px;
}

.personalized {
    width: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #F9FAFB;
    border-radius: 20px;
}

.container__frm {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.amount__container {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
    cursor: pointer;
    color: var(--text-color-form);
}

.amount__container:hover {
    background-color: #F3F4F6;
}

.amount__container.selected {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
    color: white;
}

.amount {
    font-size: 1rem;
    font-weight: 400;
}

.input-wrapper input {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
}

.input-wrapper input:focus {
    border-color: var(--primary-color);
    outline: none;
}

.frequency {
    display: flex;
    gap: 15px;
}

.frequency button {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
    cursor: pointer;
    background-color: white;
    color: var(--text-color-form);
}

.frequency button:hover {
    background-color: #F3F4F6;
}

.frequency button .activo {
    background-color: var(--primary-color);
}

.frequency button.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.button__container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.button__container button {
    border: 1px solid var(--primary-color);
    border-radius: 10px;
    padding: 15px;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
    cursor: pointer;
    background-color: var(--primary-color);
    color: white;
}

.button__container button:hover {
    filter: brightness(90%);
}

.button__container__volunteer {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.button__text {
    width: auto;
    font-size: .8rem;
    font-weight: 400;
    color: var(--text-color-form);
}

.image {
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    height: 280px;
}

.image::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center,
            rgba(0, 0, 0, 0.1) 40%,
            rgba(0, 0, 0, 0.35) 80%);
    pointer-events: none;
    z-index: 1;
}

.image__title {
    position: absolute;
    bottom: 0;
    padding: 15px;
    color: white;
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 600;
    z-index: 2;
}

.impact__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.aditional__impact {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: rgba(128, 128, 128, 0.1);
    border-radius: 15px;
    padding: 15px;
}

.description {
    color: var(--text-color-form);
    line-height: 1.3
}

.aditional__title {
    font-size: clamp(1rem, 3vw, 1.2rem);
    font-weight: 500;
    color: var(--primary-color);
}

.aditional__description {
    color: var(--text-color-form);
    line-height: 1.3;
}

.details__cards {
    display: flex;
    gap: 20px;
}

.details__card {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 15px;
    border-radius: 15px;
    gap: 5px;
}

.icon {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon span {
    width: 20px;
    height: 20px;
    color: var(--secondary-color);
}

.title__card {
    display: flex;
    align-items: center;
    gap: 5px;
}

.details__card__title {
    font-weight: 500;
    color: var(--secondary-color);
}

.details__card__description {
    color: var(--text-color-form);
}

.specific_goals {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cta {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color-cta);
    padding: 50px;
    border-radius: 15px;
    gap: 10px;
}

.cta__title {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 600;
    color: var(--title-color-cta);
    text-align: center;
}

.cta__description {
    line-height: 1.3;
    color: var(--text-color-cta);
    text-align: center;
}

.card__section {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 15px;
    overflow: hidden;
    background-color: var(--bg-color-card);
}

.card__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;
    height: calc(100% - 250px);
    justify-content: space-between;
}

.card__texts {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card__title {
    font-size: clamp(1rem, 3vw, 1.3rem);
    font-weight: 700;
    color: var(--title-color-card);
}

.card__description {
    line-height: 1.3;
    color: var(--text-color-card);
}

.goal__image {
    width: 100%;
    height: 250px;
    position: relative;
}

.deadline {
    position: absolute;
    width: auto;
    top: 5%;
    right: 2.5%;
    color: var(--primary-color);
    background-color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: clamp(0.9rem, 3vw, 0.9rem);
    font-weight: 600;
    border: 1px solid var(--primary-color);
}

.goal__image img {
    object-fit: cover;
}

.goal__button {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;
    cursor: pointer;
    background-color: white;
    color: var(--text-color-card);
    transition: all .3s ease;
}

.goal__button:hover {
    border: 1px solid var(--primary-color);
    background-color: var(--primary-color);
    color: white;
}

.progress__content {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    color: var(--text-color-card);
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

.possible__amount {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: rgba(172, 128, 93, 0.815);
    transition: width 0.6s ease-in-out;
    z-index: 0;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    overflow-y: auto;
    overflow-x: hidden;
}

.title__group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.title__modal {
    font-size: clamp(1.1rem, 3vw, 1.2rem);
    font-weight: 500;
    color: var(--title-color-form);
}

.modal__content {
    width: 600px;
    display: flex;
    flex-direction: column;
    margin: auto;
    gap: 20px;
    padding: 20px 10px;
}

.data__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
}

form {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.close {
    position: fixed;
    top: 30px;
    right: 50px;
    width: 50px;
    color: white;
    font-weight: bolder;
    z-index: 40;
    cursor: pointer;
    transition: all .3s ease;
}

.close:hover {
    color: var(--primary-color);
    scale: 1.2;
}

.get__data__container {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 30px;
    gap: 20px;
    border-radius: 15px;
}

.loader__container {
    display: flex;
    background-color: white;
    border-radius: 15px;
    height: 308px;
}

label {
    color: var(--text-color-formV);
}

.terms {
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
    background-color: white;
}

select.selected {
    color: var(--text-color-formV);
}

input::placeholder {
    color: #888;
}

input:valid:not(:placeholder-shown),
textarea:valid:not(:placeholder-shown) {
    color: var(--text-color-formV);
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

br {
    display: none;
}

.form__row {
    display: flex;
    gap: 20px;
}

.form__group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.phone__input__wrapper {
    display: flex;
}

.phone__prefix {
    width: auto;
    text-align: center;
    display: flex;
    align-items: center;
    border-radius: 10px 0 0 10px;
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-right: none;
    padding: 10px;
    color: #888;
    background-color: #0000000e;
}

.button__container__modal {
    display: flex;
    gap: 20px;
}

.phone {
    border-radius: 0 10px 10px 0;
}

.volunteer__form {
    border-radius: 10px;
}

.modal__button {
    border: 1px solid var(--primary-color);
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;
    cursor: pointer;
    background-color: var(--primary-color);
    color: white;
    transition: filter .3s ease;
}

.modal__button.cancel {
    background-color: white;
    color: var(--primary-color);
}

.modal__button:hover {
    filter: brightness(90%);
}

.overlay__goal__details {
    position: absolute;
    bottom: 0;
    color: white;
    z-index: 2;
    padding: 15px;
}

.goal__details__container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 10px;
    border-radius: 10px;
}

.image__title__goal {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 600;
}

.goal__details__container p {
    font-size: clamp(1.1rem, 3vw, 1.2rem);
    font-weight: 450;
}

.get__amount__goal {
    display: flex;
    width: auto;
}

.get__amount__goal .amount__frm {
    display: flex;
    max-width: 100%;
    gap: 100px;
    background-color: white;
}

#txtNumeroTarjeta,
#txtFechaVencimiento,
#txtCvv {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;
    color: #888;
    /*  overflow: hidden; */
}

.content__card__data {
    display: flex;
    gap: 20px;
}

/* .row:not(:first-of-type) {
    max-width: 50%;
} */

small {
    padding-top: 5px;
    color: #E25950;
    font-size: 14px;
}

#txtCvv {
    padding-left: 10px !important;
}

/* VOLUNTARIADO */
.volunteer {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.volunteer__section {
    display: flex;
    padding: 0;
    margin: 0;
    gap: 40px;
}

.first__title {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 500;
    color: var(--title-color-form);
}

.card__title__volunteer {
    font-size: clamp(1rem, 3vw, 1.3rem);
    font-weight: 700;
    color: var(--title-color-cardV);
}

.card__description__volunteer {
    padding-top: 10px;
    line-height: 1.3;
    color: var(--text-color-cardV);
}

.card__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card {
    display: flex;
    gap: 10px;
    padding: 20px;
    background-color: var(--bg-color-cardV);
    border-radius: 15px;
}

.card__icon {
    max-width: 50px;
    height: max-content;
    background-color: rgba(126, 126, 126, 0.151);
    border-radius: 10px;
    padding: 10px;
    display: flex;
}

.card__icon img {
    object-fit: contain;
    height: auto;
}

.card__container__characteristic {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 10px;
}

.card__characteristics {
    display: flex;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    gap: 5px;
}

.card__characteristics h4 {
    color: var(--primary-color);
    width: auto;
}

.card__characteristics p {
    color: var(--text-color-cardV);
}

ul {
    list-style-type: disc;
    padding-left: 1.5rem;
}

li {
    line-height: 1.3;
}

li::marker {
    color: var(--primary-color);
    font-size: 1.2em;
}

li:not(:first-child) {
    padding-top: 5px;
}

strong {
    color: var(--primary-color);
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form form {
    border: 1px solid rgba(185, 185, 185, 0.3);
    padding: 30px;
    border-radius: var(--border-radius);
    background-color: var(--bg-color-formV);
    height: 1190.97px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

@media (max-width: 1024px) {
    .content {
        width: 80%;
    }

    .centered__texts {
        width: 100%;
    }

    .general__donation {
        flex-direction: column;
    }

    .amount__frm,
    .impact__frm {
        max-width: 100%;
        width: 100%;
    }

    .card__content {
        padding: 15px;
    }

    .volunteer__section {
        flex-direction: column-reverse;
    }
}

@media (max-width: 640px) {
    .content {
        width: 100%;
    }

    .cta {
        padding: 30px;
    }
}

@media (max-width: 520px) {
    .form__row {
        flex-direction: column;
    }
}

@media (max-width: 480px) {

    .form__container,
    .amount__frm,
    .impact__frm,
    .aditional__impact {
        padding: 10px;
    }

    .amount__container {
        flex: 1 1 calc(50% - 8px);
    }

    .container__frm {
        gap: 8px;
    }

    .frequency {
        gap: 8px;
    }

    .card__characteristics {
        flex-direction: column;
    }

    br {
        display: block;
    }
}

@media (max-width: 400px) {
    .details__cards {
        flex-wrap: wrap;
        gap: 10px;
    }
}

@media (max-width: 380px) {
    .type {
        gap: 5px;
    }

    .card {
        flex-direction: column;
    }
}
</style>