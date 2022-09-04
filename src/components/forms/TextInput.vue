<template>
    <div class="mb-3">
        <label :for="name" class="form-label">{{ label }}</label>
        <input :type="type" :name="name" :placeholder="placeholder" :required="required" :min="min" :max="max"
            :value="modelValue" :autocomplete="autocomplete + '-new'"
            @input="$emit('update:modelValue', $event.target.value)" class="form-control" />
        <div class="form-text">{{ help }}</div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TextInput',
    props: {
        name: String,
        type: String,
        label: String,
        placeholder: String,
        required: Boolean,
        min: String,
        max: String,
        modelValue: String,
        autocomplete: String,
        help: String
    }
});
</script>