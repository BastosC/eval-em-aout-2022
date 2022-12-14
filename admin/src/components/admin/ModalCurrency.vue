<script setup>
    import { computed, inject, ref, toRef } from "vue";
    import { useToast } from "vue-toastification";
    import { addCurrency, deleteCurrency, editCurrency } from "../../utils/api";
    import Loading from "../common/Loading.vue";

    const toast = useToast();
    const props = defineProps(["modalData", "listCurrencies"]);
    const listCurrencies = inject("listCurrencies");
    const loading = ref(false);

    const closeModal = () => {
        props.modalData.open = false;
        props.modalData.data = null;
        props.modalData.type = null;
    };
    const tempForm = computed(() => ({ ...props.modalData.data }));

    const fireAction = async () => {
        loading.value = true;
        let newList = [...listCurrencies.value];
        const index = newList.findIndex(e => e.id === props?.modalData?.data?.id);
        tempForm.value.code = tempForm.value.code.toUpperCase();

        switch (props.modalData.type) {
            case "create":
                const response_create = await addCurrency(tempForm.value);
                newList.push(response_create);
                toast.success("La monnaie à été crée avec succès.");
                break;
            case "edit":
                const response_edit = await editCurrency(tempForm.value.id, tempForm.value);
                newList[index] = response_edit;
                toast.success("La monnaie à été modifiée avec succès.");

                break;
            case "delete":
                const response_delete = await deleteCurrency(tempForm.value.id);
                newList = newList.filter(e => e.id !== response_delete.id);
                toast.success("La monnaie à été suprimée avec succès.");
                break;
            default:
                break;
        }

        listCurrencies.value = newList;
        loading.value = false;
        closeModal();
    };
</script>

<template>
    <Modal v-model="modalData.open" :close="closeModal">
        <form class="modal" v-if="modalData.open" @submit.prevent="fireAction">
            <h2 v-if="modalData.type === 'create'">Ajouter une monnaie</h2>
            <h2 v-if="modalData.type === 'edit'">Editer une monnaie</h2>
            <h2 v-if="modalData.type === 'delete'">Supprimer cette monnaie ?</h2>

            <div v-if="modalData.type === 'delete'">
                <p><b>Nom :</b> {{ modalData.data.name }}</p>
                <p><b>Code :</b> {{ modalData.data.code }}</p>
                <p>
                    <b>Symbole :</b>
                    {{
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: modalData.data.code })
                            .format(0)
                            .replaceAll("0,", "")
                            .replaceAll("0", "")
                    }}
                </p>
                <p><b>Taux:</b> 1.1</p>
            </div>

            <div v-if="modalData.type === 'create' || modalData.type === 'edit'">
                <label>Nom :</label>
                <input required type="text" maxlength="100" v-model="tempForm.name" />
                <label>Code :</label>
                <input required onkeyup="this.value = this.value.toUpperCase();" type="text" maxlength="3" minlength="3" v-model="tempForm.code" />
                <!-- <label>Symbole :</label>
                <input :disabled="true" v-model="tempForm.name" /> -->
                <label>Taux pour 1$ :</label>
                <input required min="0" type="number" v-model="tempForm.rate" />
            </div>

            <div class="actions">
                <button @click="closeModal">Retour</button>
                <button :disabled="loading">
                    <Loading v-if="loading" />
                    <span v-if="!loading && modalData.type === 'create'">Ajouter</span>
                    <span v-if="!loading && modalData.type === 'edit'">Modifier</span>
                    <span v-if="!loading && modalData.type === 'delete'">Supprimer</span>
                </button>
            </div>
        </form>
    </Modal>
</template>

<style scoped>
    .modal {
        width: 100%;
        max-width: 600px;
        padding: 30px;
        box-sizing: border-box;
        background-color: #fff;
        font-size: 20px;
        text-align: center;
        color: black;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
    }
    .modal h2 {
        margin-bottom: 30px;
    }

    input {
        font-size: 18px;
    }
    .modal label {
        text-align: left;
        margin-top: 20px;
        font-weight: bold;
        margin-bottom: 4px;
    }

    .modal > div {
        display: flex;
        flex-direction: column;
    }

    .modal p {
        margin: 8px 0;
    }

    .actions {
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row !important;
        flex-wrap: wrap;
    }

    @media (max-width: 875px) {
        .actions {
            justify-content: center;
        }
    }

    .actions > * {
        margin-bottom: 10px;
    }
    .modal button {
        padding: 10px 25px;
    }

    .modal button:first-child {
        background-color: #666666;
    }
    .modal button:first-child:hover {
        background-color: #111111;
    }
</style>
