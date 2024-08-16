// Class to represent a MenuItem
class MenuItem {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}

// Class to manage the menu list
class Menu {
    constructor() {
        this.items = [];
    }

    addItem(name, price) {
        this.items.push(new MenuItem(name, parseFloat(price)));
        this.updateMenuList();
        this.populateFoodOptions();
    }

    updateItem(oldName, newName, newPrice) {
        const item = this.items.find(item => item.name === oldName);
        if (item) {
            item.name = newName;
            item.price = parseFloat(newPrice);
            this.updateMenuList();
            this.populateFoodOptions();
        }
    }

    deleteItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.updateMenuList();
        this.populateFoodOptions();
    }

    updateMenuList() {
        const menuListTable = document.querySelector('.menu-list tbody');
        menuListTable.innerHTML = '';
        this.items.forEach(item => {
            const newRow = menuListTable.insertRow();
            newRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><button class="action-btn" onclick="menu.editItem('${item.name}')">Sửa</button></td>
                <td><button class="action-btn" onclick="menu.deleteItem('${item.name}')">Xóa</button></td>
            `;
        });
    }

    populateFoodOptions() {
        const foodSelect = document.querySelector('.food');
        foodSelect.innerHTML = '<option value="">Chọn Món Ăn</option>';
        this.items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = item.name;
            foodSelect.appendChild(option);
        });
    }
}

// Class to represent an Order
class Order {
    constructor(tableOrType) {
        this.tableOrType = tableOrType;
        this.items = [];
    }

    addItem(menuItem, quantity) {
        const existingItem = this.items.find(item => item.name === menuItem.name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ ...menuItem, quantity });
        }
    }

    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    renderOrderTable(isPaid) {
        const tableSelector = isPaid ? '.paid-orders tbody' : '.unpaid-orders tbody';
        const ordersTable = document.querySelector(tableSelector);
        ordersTable.innerHTML = '';

        this.items.forEach(item => {
            const newRow = ordersTable.insertRow();
            newRow.innerHTML = `
                <td>${this.tableOrType}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                ${!isPaid ? '<td><button class="pay-btn">Thanh Toán</button></td>' : ''}
            `;
        });
    }
}

// Initialize Menu and Orders
const menu = new Menu();
const unpaidOrders = [];

// Add initial menu items
menu.addItem('Phở', 35);
menu.addItem('Cơm Tấm', 30);
menu.addItem('Gà Rán', 35);
menu.addItem('Bún', 35);
menu.addItem('Bánh Mì', 35);

document.addEventListener('DOMContentLoaded', () => {
    menu.updateMenuList();
    menu.populateFoodOptions();
});

// Event handlers
function selectOption(option) {
    window.selectedTableOrType = option;
    alert('Bạn đã chọn: ' + option);
}

function addToOrder() {
    const foodSelect = document.querySelector('.food');
    const quantityInput = document.getElementById('quantity');
    const selectedFood = foodSelect.value;
    const quantity = parseInt(quantityInput.value, 10);

    if (selectedFood && quantity > 0) {
        const menuItem = menu.items.find(item => item.name === selectedFood);
        if (menuItem) {
            const order = unpaidOrders.find(o => o.tableOrType === window.selectedTableOrType);
            if (order) {
                order.addItem(menuItem, quantity);
            } else {
                const newOrder = new Order(window.selectedTableOrType);
                newOrder.addItem(menuItem, quantity);
                unpaidOrders.push(newOrder);
            }
            updateUnpaidOrdersTable();
        }
    }

    foodSelect.value = '';
    quantityInput.value = '';
}

function updateUnpaidOrdersTable() {
    const unpaidOrdersTable = document.querySelector('.unpaid-orders tbody');
    unpaidOrdersTable.innerHTML = '';

    unpaidOrders.forEach(order => {
        order.renderOrderTable(false);
    });

    document.querySelectorAll('.pay-btn').forEach(button => {
        button.addEventListener('click', function () {
            const row = button.parentNode.parentNode;
            const tableOrType = row.cells[0].innerHTML;
            const order = unpaidOrders.find(o => o.tableOrType === tableOrType);

            if (order) {
                const index = unpaidOrders.indexOf(order);
                unpaidOrders.splice(index, 1);

                order.renderOrderTable(true);

                const paidOrdersTable = document.querySelector('.paid-orders tbody');
                paidOrdersTable.appendChild(row);
            }
        });
    });
}

function addMenuItem() {
    const name = prompt('Nhập tên món ăn:');
    const price = prompt('Nhập giá món ăn:');
    if (name && price && !isNaN(price)) {
        menu.addItem(name, price);
    }
}

function editMenuItem(name) {
    const newName = prompt('Nhập tên món ăn mới:', name);
    const newPrice = prompt('Nhập giá món ăn mới:');
    if (newName && newPrice && !isNaN(newPrice)) {
        menu.updateItem(name, newName, newPrice);
    }
}

function deleteMenuItem(name) {
    if (confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
        menu.deleteItem(name);
    }
}
