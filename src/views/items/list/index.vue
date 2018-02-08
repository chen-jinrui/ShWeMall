<template>
  <div class="item_list"
    v-waterfall-lower="loadMore"
    waterfall-disabled="disabled"
    waterfall-offset="100">
    
    <form action="/search">
      <van-search 
      placeholder="请输入商品名称" 
      v-model="searchVal"
      @search="resetInit" 
      showAction />
    </form>
    
    <van-tabs @click="handleTabClick" @disabled="handleTabClick">
      <van-tab 
        v-for="tab in tabsItem"
         :title="tab.name" 
        :key="tab.type" 
        :disabled="tab.sort === false">
      </van-tab>
    </van-tabs>
    
    <van-popup 
      class="filterItem"
      v-model="filterItemShow" 
      position="right" 
    >
      <ul>
        <li 
          v-for="(li, i) in filterItem"
          :key="i"
          @click="filterMethod(i)" 
          :class="{filter_active: li.isActive}">
            {{li.name}}
          <van-icon name="success" v-show="li.isActive" class="float-r" />
        </li>
      </ul>
    </van-popup>
    
    
    <item-group>
      <item-card-hori
        v-for="(item, i) in items" 
        :key="i"
        :goods="item"
        @click="itemClick(item.id)"
       />
    </item-group>
    
    <van-loading 
      type="gradient-circle" 
      color="black" 
      class="items_loading" 
      v-show="isLoading"
    />
    
    <is-empty v-model="isEmpty">抱歉,没有找到符合条件商品</is-empty>
    
    <van-popup 
      v-model="noMore" 
      position="bottom" 
      :overlay="false"
    >没有更多了</van-popup>
    
    <transition name="fade">
      <van-icon name="arrowupcircle" class="backTop" @click.native="backTop" v-show="showArrow"></van-icon>
    </transition>
  </div>
</template>

<script>
  import ItemGroup from '@/vue/components/item-group/';
  import IsEmpty from '@/vue/components/is-empty/';
  import ItemCardHori from '@/vue/components/item-card-hori/';
  import { Search, Loading, Tab, Tabs } from 'vant';
  import loadMore from '@/vue/mixin/load-more';
  import { GOODS_SEARCH } from '@/api/goods';
  
  export default {
    name: 'Item-list',
    props: {
      keyword: {
        type: String,
        default: ''
      },
      itemClass: {
        type: [String, Number],
        default: ''
      }
    },
  
    mixins: [loadMore],
  
    data() {
      const shop_id = this.$util.getLocationParam('shop_id');
      return {
        shop_id,
        tabsItem: [
          { name: '默认', sort: '' },
          { name: '销量', sort: 'sold_quantity' },
          { name: '最新', sort: 'created_at' },
          { name: '筛选', sort: false }
        ],
        sortVal: '',
        is_haitao: 0,
        filterItem: [{
          name: '全部',
          filterType: 2,
          isActive: true
        }, {
          name: '店铺商品',
          filterType: 0,
          isActive: false
        }, {
          name: '海淘商品',
          filterType: 1,
          isActive: false
        }],
        isHaitao: 2,
        searchVal: '',
        filterItemShow: false,
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
          cid: this.itemClass,
          'per-page': this.pages.perPage,
          page: this.pages.currPage,
          sort: this.sortVal,
          is_haitao: this.isHaitao
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
      handleTabClick(index) {
        if (index === 3) {
          this.filterItemShow = true;
        } else {
          const sortVal = this.tabsItem[index].sort;
          if (sortVal !== this.sortVal) {
            this.sortVal = sortVal;
            this.resetInit();
          }
        }
      },
      filterMethod(i) {
        this.filterItem.forEach((item, index) => {
          item.isActive = i === index;
        });
        const filterType = this.filterItem[i].filterType;
        this.filterItemShow = false;
        if (this.isHaitao !== filterType) {
          this.isHaitao = filterType;
          this.resetInit();
        }
      },
      backTop() {
        document.getElementById('app').scrollTop = 0;
      },
      itemClick(id) {
        this.$router.push({ name: 'detail', params: { itemId: id }});
      }
    },
  
    components: {
      [ItemGroup.name]: ItemGroup,
      [ItemCardHori.name]: ItemCardHori,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Search.name]: Search,
      [Loading.name]: Loading,
      [IsEmpty.name]: IsEmpty
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/var";
  
  .fade-enter,
  .fade-leave-to{
    opacity: 0;
  }
  
  .fade-enter-active,
  .fade-leave-active,{
    transition:  all .5s;
  }
  
  
  .item_list{
    height: 100%;
    background-color: #fff;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-bottom: 0;
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
  .filterItem{
    width: 40%;
    height: 100%;
    li{
      padding: 10px;
      &.filter_active{
        color: $red;
      }
    }
  }
  .backTop{
    position: fixed;
    right: 20px;
    bottom: 20px;
    font-size: 24px;
  }
</style>
