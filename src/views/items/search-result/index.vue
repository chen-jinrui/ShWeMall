<template>
  <div class='item_list'
    v-waterfall-lower='loadMore'
    waterfall-disabled='disabled'
    waterfall-offset='100'>
    
    <form action='/search' class='fixedTop'>
      <van-search 
      placeholder='请输入商品名称' 
      v-model='searchVal'
      @search='resetInit' 
      showAction />
    </form>
    
    <item-group>
      <item-card-hori
        v-for='(item, i) in items' 
        :key='item.id'
        :goods='item'
        @click='itemClick(i)'
       />
    </item-group>
    
    <van-loading 
      type='gradient-circle' 
      color='black' 
      class='items_loading' 
      v-show='isLoading'
    />
    
    <is-empty v-model='isEmpty'>抱歉,没有找到符合条件商品</is-empty>
    
    <van-popup 
      v-model='noMore' 
      position='bottom' 
      :overlay='false'
    >没有更多了</van-popup>
    
    <transition name='fade'>
      <van-icon name='arrowupcircle' class='backTop' @click.native='backTop' v-show='showArrow'></van-icon>
    </transition>
  </div>
</template>

<script>
  import ItemGroup from '@/vue/components/item-group/';
  import IsEmpty from '@/vue/components/is-empty/';
  import ItemCardHori from '@/vue/components/item-card-hori/';
  import { Search, Loading } from 'vant';
  import loadMore from '@/vue/mixin/load-more';
  import { GOODS_SEARCH } from '@/api/goods';
  
  export default {
    name: 'Item-list',
    props: {
      keyword: {
        type: String,
        default: ''
      }
    },
  
    mixins: [loadMore],

    data() {
      const shop_id = this.$util.getLocationParam('shop_id');
      return {
        shop_id,
        searchVal: '',
        showArrow: false
      };
    },
  
    activated() {
      this.searchVal = this.keyword;
      this.resetInit();
      this.eventListen();
    },
  
    deactivated() {
      document.getElementById('app').removeEventListener('scroll', this.scrollShowArrow);
    },
  
    created() {
      this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
    },
  
    methods: {
      initData(loadMore = false) {
        return this.$reqGet(GOODS_SEARCH, {
          q: this.searchVal,
          shop_id: this.shop_id,
          'per-page': this.pages.perPage,
          page: this.pages.currPage
        }, {
          hideLoading: true
        }).then(res => {
          const { items, page } = res.data.data;
          this.items.push(...items);
          return page;
        });
      },
      eventListen() {
        document.getElementById('app').addEventListener('scroll', this.scrollShowArrow);
      },
      scrollShowArrow() {
        this.showArrow = document.getElementById('app').scrollTop > 120;
      },
      backTop() {
        document.getElementById('app').scrollTop = 0;
      },
      itemClick(i) {
        this.$router.push({ name: 'detail', params: { itemId: i }});
      }
    },

    components: {
      [ItemGroup.name]: ItemGroup,
      [ItemCardHori.name]: ItemCardHori,
      [Search.name]: Search,
      [Loading.name]: Loading,
      [IsEmpty.name]: IsEmpty
    }
  };
</script>

<style lang='scss' scoped>
  @import '../../../assets/scss/var';
  
  .fade-enter,
  .fade-leave-to{
    opacity: 0;
  }
  
  .fade-enter-active,
  .fade-leave-active,{
    transition:  all .5s;
  }
  
  
  .item_list{
    background-color: #fff;
    padding-top: 50px;
    box-sizing: border-box;
  }
  .fixedTop{
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 999;
  }
  
  .items_loading{
    margin: 0 auto;
  }
  .backTop{
    position: fixed;
    right: 20px;
    bottom: 20px;
    font-size: 24px;
  }
</style>
