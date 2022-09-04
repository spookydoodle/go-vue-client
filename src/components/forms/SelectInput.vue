<template>
    <div class="mb-3">
        <label :for="name" class="form-label">{{ label }}</label>
        <select :id="name" class="form-select" :name="name" :required="required" :multiple="multiple"
            :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
            <option disabled value="">Choose...</option>
            <option v-for="option in items" :value="option.value" v-bind:key="option.value">
                {{ option.text }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SelectInput',
    props: ["items", "name", "required", "label", "modelValue", "multiple"],
});
</script>