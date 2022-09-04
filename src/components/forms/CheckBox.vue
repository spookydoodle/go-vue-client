<template>
    <div class="mb-3 form-check">
        <input class="form-check-input" :checked="checked" :required="required" type="checkbox" :value="value"
            :name="name" :id="name">
        <label class="form-check-label" :for="name">
            {{ label }}
        </label>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CheckBox',
    props: ["label", "required", "name", "value", "checked"],
})
</script>