<template>
  <div :class='inputBtn ? "input-group time input-btn" : "input-group date"' 
      :style="'width:' + isFullWidth + '%'">
    <input type="text" class="w-100" v-model="time" @input="inputTimePicker" ref="timeInput" />
    <button class="cal-btn cal-btn2 input-group-addon" style="float: right;">
      <font-awesome-icon :icon="['fas', 'clock']" />
    </button>
  </div>
</template>

<script>
import '@/static/plugins/timepicker/jquery.timepicker.js';
import '@/static/plugins/timepicker/jquery.timepicker.min.js';
import '@/static/plugins/timepicker/jquery.timepicker.css';

import { DateUtil } from '@/utils/DateUtil.js'

export default {
  name: 'timepicker',
  props: {
    stndTm: {
      type: String,
      required: false,
    },
    inputBtn: {
      type: Boolean,
      default: true,
      required: false,
    },
    isFullWidth: {
      type: Number,
    }
  },
  data() {
    return {
      time: '',
      isClear: false
    }
  },
  methods: {
    init() {
      this.makeTimepicker();
    },
    makeTimepicker() {
      const $this = this;
      $(this.$refs.timeInput).timepicker({
        timeFormat: 'H:mm',
        step: 10,
        defaultTime: this.stndTm,
        dropdown: true,
        scrollbar: true
      }).on("changeTime", function () {
        const selectedTime = $(this).val();
        $this.time = selectedTime;
        $this.$emit('onSelected', selectedTime);
      });
      let currTm = DateUtil.getCurrTime("HH") + ":00";
      this.setTime(currTm);
    },
    inputTimePicker() {
      if (this.ValdUtil.isNull(this.time)){
        return false;
      } 
      if (this.time.length > 4) {
        let numTm = this.CmonUtil.extractNumbers(this.time);
        if (numTm.length >= 4) {
          this.time = this.DateUtil.getFormatTime(numTm);
          this.setTime(this.time);
        }
      }
    },
    setTime(tm) {
      this.time = tm;
      $(this.$refs.timeInput).timepicker('setTime', tm);
    },
  },
  watch: {
    stndTm(newVal, oldVal) {
      if (!newVal && oldVal && !this.isClear && oldVal.length >= 4) {
        this.setTime(oldVal);
      } else if (newVal && !this.isClear && newVal.length >= 4) {
        this.setTime(newVal);
      } else {
        this.setTime(this.stndTm);
        this.isClear = false;
      }
    }
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    const $el = $(this.$refs.timeInput);
    if ($el.data('timepicker')) {
      $el.timepicker('remove');
    }
  }
}
</script>
