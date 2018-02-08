<template>
  <van-popup v-model="isShow" position="bottom">
    <van-area :areaList="areaList" @confirm="areaConfirm" @cancel="areaCanccel" />
  </van-popup>
</template>


<script>
  import areaList from './area.json';
  import { Area } from 'vant';
  export default {
    name: 'popup-area',
  
    model: {
      prop: 'areaPopup',
      event: 'change'
    },
  
    props: {
      areaPopup: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        areaList,
        isShow: false
      };
    },
  
    watch: {
      areaPopup(val) {
        this.isShow = val;
      },
      isShow(val) {
        this.$emit('change', val);
      }
    },
  
    methods: {
      areaCanccel() {
        this.isShow = false;
      },
      areaConfirm(areaData) {
        if (areaData.every(area => area.code !== -1)) {
          this.isShow = false;
          this.$emit('confirm', this.analyArea(areaData));
        } else {
          this.$toast({ message: '请选择完整地区', duration: 1500 });
        }
      },
      analyArea(areaData) {
        const province = areaData[0] || {};
        const city = areaData[1] || {};
        const district = areaData[2] || {};
        return {
          id: null,
          area_name: `${province.name}  ${city.name}  ${district.name} `,
          district: district.code,
          city: city.code,
          province: province.code
        };
      }
    },
  
    components: {
      [Area.name]: Area
    }
  };
</script>