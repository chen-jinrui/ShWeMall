<template>
  <div class="user_collect"
    v-waterfall-lower="loadMore"
    waterfall-disabled="disabled"
    waterfall-offset="100">
    
    <form action="/search" class="fixedTop">
      <van-search 
      placeholder="请输入商品名称" 
      v-model="searchVal"
       />
    </form>
    
    <item-group>
      <item-card-hori
        v-for="(item, i) in items" 
        :style="{backgroundColor: !item.goods_status && '#fcfcfc'}"
        :key="i"
        :goods="item"
        @click="itemClick(i)"
       >
        <van-icon 
          name="lajitong" 
          slot="footer" 
          @click.stop="cancelCollect($event, i)" 
          style="float: right;"
        />
      </item-card-hori>
    </item-group>
    
    <van-loading 
      type="gradient-circle" 
      color="black" 
      class="items_loading" 
      v-show="isLoading"
    />
    
    <is-empty v-model="isEmpty">没有商品收藏</is-empty>
    
    <van-popup 
      v-model="noMore" 
      position="bottom" 
      :overlay="false"
    >没有更多了</van-popup>
    
    <div class="clear_invalid" v-if="items.length" @click="clearInvalid">
      <van-icon name="lajitong"/>
      清除失效商品
    </div>
    
  </div>  
</template>

<script>
  import ItemGroup from '@/vue/components/item-group/';
  import ItemCardHori from '@/vue/components/item-card-hori/';
  import IsEmpty from '@/vue/components/is-empty/';
  import { GOODS_COLLECT_LIST } from '@/api/user';
  import { Search } from 'vant';
  import loadMore from '@/vue/mixin/load-more';

  export default {

    mixins: [loadMore],

    data() {
      const shop_id = this.$util.getLocationParam('shop_id');
      return {
        shop_id,
        items: [],
        searchVal: ''
      };
    },

    created() {
      this.resetInit();
    },
  
    methods: {
      initData() {
        return this.$reqGet(GOODS_COLLECT_LIST, {
          'per-page': this.pages.perPage,
          page: this.pages.currPage,
          shop_id: this.shop_id
        }, {
          hideLoading: true
        }).then(res => {
          const { items, page } = res.data.data;
          this.items.push(...items);
          return page;
        });
      },
      cancelCollect(event, i) {
        const item_id = this.items[i].item_id;
        this.$dialog.confirm({ message: '是否取消收藏该商品' }).then(() => {
          this.items.splice(i, 1);
        });
      },
      clearInvalid() {
        this.$dialog.confirm({ message: '确定清除所有失效商品吗?' });
      },
      itemClick(i) {
        const item_id = this.items[i].item_id;
        const status = this.items[i].goods_status;
        status && this.$router.push({
          name: 'detail',
          params: { itemId: item_id }
        });
        !status && this.$toast('该商品已失效');
      }
    },

    components: {
      [ItemGroup.name]: ItemGroup,
      [ItemCardHori.name]: ItemCardHori,
      [Search.name]: Search,
      [IsEmpty.name]: IsEmpty
    }
  };

</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/var";
  .clear_invalid {
    width: 120px;
    color: $font-color-gray;
    border: 1px solid $font-color-gray;
    margin: 0 auto;
    text-align: center;
    padding: 5px 3px;
    margin-top: 20px;
    border-radius: 3px;
  }

</style>
