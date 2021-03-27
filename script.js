let initialize = () => {
  let item_container = document.getElementById("item-container");
  for(let item = 0; item < items.length; item++) {
    for(let eggs = 0; eggs < 3; eggs++) {
      if(items[item].name === "dai gia dau" || items[item].name === "dai gia t/c") {
        eggs = 6;
      }
      if(items[item].price[eggs] != "n/a") {
        item_container.innerHTML += `<button class="item" onclick="select_item(${item}, ${eggs})">
            <h2>${items[item].name} (${eggs} egg)</h2>
            <h3>$${items[item].price[eggs].toFixed(2)}</h3>
          </button>`
      }
    }
  }
}

let select_item = (item_num, num_eggs) => {
  item = items[item_num];
  item_name = item.name
  if(item_name in receipt) {
    receipt[item_name].count[num_eggs] += 1;
  }
  else {
    receipt[item_name] = {"count": [0, 0, 0, 0, 0, 0, 0], "item": item};
    receipt[item_name].count[num_eggs] = 1;
  }
  reload_receipt();
}

let reload_report = data => {
  let report_el = document.getElementById("report");
  let report_string = "";
  let total_cakes = 0;
  let total_money = 0;
  report_string += `<table>
    <tr>
      <th>Quantity</th>
      <th>Type</th>
      <th>Eggs</th>
      <th>Price</th>
    </tr>
  `;
  for(item in data) {
    for(let eggs = 0; eggs < 3; eggs++) {
      if(item === "dai gia dau" || item === "dai gia t/c") {
        eggs = 6;
      }
      if(data[item].count[eggs] > 0) {
        report_string += `<tr class="report-row">
          <td>${data[item].count[eggs]}</td>
          <td>${item}</td>
          <td>${eggs}</td>
          <td>$${(data[item].count[eggs] * data[item].item.price[eggs]).toFixed(2)}</td>
        </tr>`;
        total_cakes += data[item].count[eggs];
        total_money += data[item].count[eggs] * data[item].item.price[eggs];
      }
    }
  }
  report_string += `<tr class="report-total-row">
      <td class="report-total-row">${total_cakes}</td>
      <td class="report-total-row">Total</td>
      <td class="report-total-row"></td>
      <td class="report-total-row">$${total_money.toFixed(2)}</td>
    </tr>
  </table>`;

  report_el.innerHTML = report_string;
}

let reload_receipt = () => {
  let receipt_items_el = document.getElementById("receipt-itemized");
  let receipt_total_el = document.getElementById("receipt-total");
  let total = 0;
  receipt_items_el.innerHTML = "";
  for(item in receipt) {
    for(let eggs = 0; eggs < 3; eggs++) {
      if(item === "dai gia dau" || item === "dai gia t/c") {
        eggs = 6;
      }
      if(receipt[item].count[eggs] > 0) {
        receipt_items_el.innerHTML += `<div class="receipt-item">
          <h3>(${receipt[item].count[eggs]}) ${item} (${eggs} eggs)</h3>
          <p>    $${receipt[item].item.price[eggs].toFixed(2)}</p>
        </div>`
        total += receipt[item].count[eggs] * receipt[item].item.price[eggs];
      }
    }
  }
  receipt_total_el.innerHTML = `<hr><h2>Total: $${total.toFixed(2)}</h2>`;
}

let clear_receipt = () => {
  receipt = {};
  reload_receipt();
}

let buy_items = () => {
  totals = JSON.parse(window.localStorage.getItem("mooncake-totals"));
  for(item in receipt) {
    if(item in totals) {
      for(let i = 0; i < receipt[item].count.length; i++) {
        totals[item].count[i] += receipt[item].count[i];
      }
    }
    else {
      totals[item] = receipt[item];
    }
  }

  window.localStorage.setItem("mooncake-totals", JSON.stringify(totals));

  print_receipt();

  receipt = {};
  reload_receipt();
}

let print_report = () => {
  if(JSON.stringify(receipt) !== "{}") {
    window.alert("Please either buy or cancel the items on the current receipt before looking at totals.")
    return false;
  }
  else {
    totals = JSON.parse(window.localStorage.getItem("mooncake-totals"));
    reload_report(totals);

    window.print();
  }
}

let print_receipt = () => {
  reload_report(receipt);
  window.print();
}

let clear_totals = () => {
  window.localStorage.setItem("mooncake-totals", JSON.stringify({}));
}

let items = [
    {"name": "dau xanh", "price": [4.00, 4.50, 5.50]},
    {"name": "dua", "price": [3.50, 4.00, 5.00]},
    {"name": "hat sen", "price": [3.50, 4.00, 5.00]},
    {"name": "khoai mon", "price": [3.50, 4.00, 5.00]},
    {"name": "thap cam", "price": [4.50, 4.50, 5.00, 6.00]},
    {"name": "deo dau xanh", "price": [6.00, 6.50, "n/a"]},
    {"name": "deo thap cam", "price": [6.00, 6.50, "n/a"]},
    {"name": "deo khoai mon", "price": [6.00, 6.50, "n/a"]},
    {"name": "dau sau rieng", "price": [4.50, "n/a", 6.00]},
    {"name": "thap cam DB", "price": ["n/a", "n/a", 8.25]},
    {"name": "dai gia dau", "price": ["n/a", "n/a", "n/a", "n/a", "n/a", "n/a", 25.00]},
    {"name": "dai gia t/c", "price": ["n/a", "n/a", "n/a", "n/a", "n/a", "n/a", 31.00]},
];

// Initialize the totals
if(JSON.parse(window.localStorage.getItem("mooncake-totals")) !== null) {
  let totals = JSON.parse(window.localStorage.getItem("mooncake-totals"));
}
else {
  let totals = {};
  window.localStorage.setItem("mooncake-totals", JSON.stringify(totals));

}
let receipt = {};

initialize();