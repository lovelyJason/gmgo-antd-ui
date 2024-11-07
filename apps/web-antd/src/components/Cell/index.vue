<script>
export default {
  name: 'Cell',
  props: {
    border: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    extra: {
      type: String,
      default: '',
    },
  },
};
</script>

<template>
  <div class="cell">
    <div :class="border ? 'myborder' : ''" class="cell-inner">
      <div class="cell-item">
        <div class="cell-item-label">
          <span v-if="label">
            {{ label }}
          </span>
          <span v-else><slot name="label"></slot> </span>
        </div>
        <div class="cell-item-value">
          <span v-if="value">
            {{ value }}
          </span>
          <span v-else>
            <slot name="value"></slot>
          </span>
        </div>
      </div>
      <div class="cell-item mt-[5px]">
        <span v-if="extra">{{ extra }}</span>
        <span v-else><slot name="extra"></slot></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cell-inner {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 0;
  overflow: hidden;
  font-size: 14px;
  line-height: 24px;
  color: #323233;
  background-color: #fff;

  .cell-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cell-item-label {
    span {
      font-size: 14px;
      line-height: 24px;
      color: #323233;
    }
  }

  .cell-item-value {
    color: #969799;
  }
}

.myborder {
  position: relative;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    pointer-events: none;
    content: ' ';
    border-bottom: 1px solid #e6ebf5;
  }
}
</style>
