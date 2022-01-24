
let order_type = 1;
export default function getOrderType(){
    window.addEventListener('storage', () => {
        order_type = window.localStorage.getItem('SelectedOrderType')
      });
}
