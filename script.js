const tamBuffer = document.querySelector('.size-buffer > input')
const contentBuffer = document.querySelector('.buffer-content')
const columnsProducer = document.querySelectorAll(".producer .column");
const columnsConsumer = document.querySelectorAll(".consumer .column")
let empty = document.querySelector('.size-buffer > input').value
const produceOperation = document.querySelectorAll('.producer-operation')
const consumerOperation = document.querySelectorAll('.consumer-operation')
let full = Number(document.querySelector('#full').textContent)
let ativo = false
let mutex = 1

var listProducer = []
var listConsumer = []



document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
});

document.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
});


function hasClass(element, className) {
    return element.classList.contains(className);
}

const updateListsProcess = () => {

    listConsumer = []
    listProducer = []


    document.querySelectorAll('.producer-operation').forEach(el => {
        listProducer.push(el.textContent)
    })

    document.querySelectorAll('.consumer-operation').forEach(el => {
        listConsumer.push(el.textContent)
    })

}

updateListsProcess()


columnsProducer.forEach((item) => {
    item.addEventListener("dragover", (e) => {
        e.preventDefault(); // Evita o comportamento padrão de não permitir soltar elementos

        const dragging = document.querySelector(".dragging");

        // Verifica se o elemento sendo arrastado tem a classe "producer-operation"
        if (dragging && hasClass(dragging, "producer-operation")) {
            const applyAfter = getNewPosition(item, e.clientY);

            if (applyAfter) {


                updateListsProcess()
                applyAfter.insertAdjacentElement("afterend", dragging);
            } else {
                updateListsProcess()

                item.prepend(dragging);
            }
        }
    });



});

columnsConsumer.forEach((item) => {
    item.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");

        // Verifica se o elemento sendo arrastado tem a classe "consumer-operation"
        if (dragging && hasClass(dragging, "consumer-operation")) {
            const applyAfter = getNewPosition(item, e.clientY);

            if (applyAfter) {
                applyAfter.insertAdjacentElement("afterend", dragging);
                //updateListsProcess()
            } else {
                // alert(0)
                // updateListsProcess()
                item.prepend(dragging);
            }
        }
    });

});


function getNewPosition(column, posY) {
    const cards = column.querySelectorAll(".item:not(.dragging)");
    let result;

    for (let refer_card of cards) {
        const box = refer_card.getBoundingClientRect();
        const boxCenterY = box.y + box.height / 2;

        if (posY >= boxCenterY) result = refer_card;
    }

    return result;
}


const removeBufferItems = () => {
    const bufferItems = document.querySelectorAll('.buffer-item');
    bufferItems.forEach(item => {
        item.remove();
    });
};

const createBuffer = () => {
    ativo = true

    updateListsProcess()



    document.querySelector('.arrow-producer').style.display = 'block'
    document.querySelector('.arrow-consumer').style.display = 'block'


    if (tamBuffer.value < 0) return
    removeBufferItems()

    if (tamBuffer.value == 0) {
        document.querySelector('.message-buffer').style.display = 'block'
        document.querySelector("#empty").innerHTML = 0
        document.querySelector("#mutex").innerHTML = 0
        mutex = 0
        document.querySelector("#full").innerHTML = 0
        return
    }

    document.querySelector('.message-buffer').style.display = 'none'

    if (tamBuffer.value > 30) {
        tamBuffer.value = 30
    }
    for (i = 0; i < tamBuffer.value; i++) {

        var buffer = document.createElement('div')
        var span = document.createElement('span')
        span.setAttribute('id', `${i}`)
        buffer.classList.add('buffer-item')

        buffer.appendChild(span)

        contentBuffer.appendChild(buffer)

    }

    document.querySelector("#empty").innerHTML = tamBuffer.value
    document.querySelector("#mutex").innerHTML = 1
    mutex = 1
    document.querySelector("#full").innerHTML = 0

    empty = tamBuffer.value
    full = 0
    currentOperationConsumer = 0
    currentOperationProduzir = 0
    tamBufferOcuped = 0

    document.querySelector(".arrow-producer").style.top = `${10}px`
    document.querySelector(".img-producer img").style.top = '30px'

    document.querySelector(".arrow-consumer").style.top = `${10}px`
    document.querySelector(".img-consumer img").style.top = '30px'

    document.querySelectorAll('.consumer-operation').forEach(e=>{
        e.style.border = '1px solid black'
    })

    document.querySelectorAll('.producer-operation').forEach(e=>{
        e.style.border = '1px solid black'
    })

    document.querySelectorAll('.img-consumer').forEach(e=>{
        e.style.display = 'none'
    })

    document.querySelectorAll('.img-producer').forEach(e=>{
        e.style.display = 'none'
    })


}

let temp
class Producer {


    down(el) {
        if (el == 'empty') {
            document.querySelector('#empty').innerHTML = Number(document.querySelector('#empty').textContent) - 1
            empty -= 1

        }
        if (el == 'mutex') {
            document.querySelector("#mutex").innerHTML = 0
            mutex = 0
        }
    }

    insertItem(tam) {
        document.querySelectorAll('.buffer-item')[tamBufferOcuped].style.background = '#DBE8F0';
        tamBufferOcuped += 1
    }

    up(el) {
        if (el == 'full') {
            temp = Number(document.querySelector("#full").innerHTML)
            temp += 1
            full += 1
            document.querySelector("#full").innerHTML = temp
        }
        if (el == 'mutex') {
            temp = Number(document.querySelector("#mutex").innerHTML)
            temp += 1
            mutex = 1
            document.querySelector("#mutex").innerHTML = temp
        }
    }
}

class Consumer {




    down(el) {
        if (el == 'full') {
            temp = document.querySelector("#full").innerHTML
            temp -= 1
            full -= 1
            document.querySelector("#full").innerHTML = temp
        }
        if (el == 'mutex') {
            document.querySelector("#mutex").innerHTML = 0
            mutex = 0
        }
    }

    consumeItem() {
        document.querySelectorAll('.buffer-item')[tamBufferOcuped - 1].style.background = 'white'
        tamBufferOcuped -= 1
    }

    up(el) {
        if (el == 'mutex') {
            document.querySelector("#mutex").innerHTML = 1
            mutex = 1
        }
        if (el == 'empty') {
            document.querySelector('#empty').innerHTML = Number(document.querySelector('#empty').textContent) + 1
            empty += 1
        }
    }
}

const producer = new Producer();
const consumer = new Consumer();

let currentOperationProduzir = 0;
let currentOperationConsumer = 0;
let tamBufferOcuped = 0


const avanceArrow = (i) => {

    if (i == 'produzir') {

        currentOperationProduzir++;

        if (currentOperationProduzir == listProducer.length) {
            document.querySelector(".arrow-producer").style.top = `${10}px`
            document.querySelector(".img-producer img").style.top = '30px'

            currentOperationProduzir = 0
        } else {
            let seta = document.querySelector(".arrow-producer").offsetTop
            document.querySelector(".arrow-producer").style.top = `${Number(seta) + 50}px`
            const elementos = document.querySelectorAll('.producer-operation');

            setTimeout(() => {
                elementos.forEach((elemento, index) => {
                    elemento.draggable = true;
                });
            }, 100)


        }
    }

    if (i == 'consumir') {

        currentOperationConsumer++

        if (currentOperationConsumer == listConsumer.length) {
            document.querySelector(".arrow-consumer").style.top = `${10}px`
            document.querySelector(".img-consumer img").style.top = '30px'

            currentOperationConsumer = 0
        } else {
            let seta = document.querySelector(".arrow-consumer").offsetTop
            document.querySelector(".arrow-consumer").style.top = `${Number(seta) + 50}px`
            const elementos = document.querySelectorAll('.consumer-operation');

            setTimeout(() => {
                elementos.forEach((elemento, index) => {
                    elemento.draggable = true;
                });
            }, 200)

        }


    }


}



const produzir = () => {

    updateListsProcess()

    if (Number(tamBuffer.value) < 1) return



    if (currentOperationProduzir < listProducer.length) {



        const operation = listProducer[currentOperationProduzir].trim()

        setTimeout(() => {
            document.querySelectorAll('.producer-operation').forEach((elemento) => {
                elemento.draggable = false;
            });
        }, 300)


        switch (operation) {


            case "Down(empty)":

                if (empty == 0) {
                    if (ativo == false) return
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid red'
                    document.querySelectorAll('.img-producer')[currentOperationProduzir].style.display = 'block'
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].removeAttribute('draggable')
                    return

                } else {
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid black'
                    document.querySelectorAll(".img-producer")[currentOperationProduzir].style.display = 'none'
                    avanceArrow('produzir')
                    producer.down('empty');
                }
                break;
            case "Down(mutex)":
                if (mutex == 0) {
                    if (ativo == false) return
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid red'
                    document.querySelectorAll('.img-producer')[currentOperationProduzir].style.display = 'block'
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].removeAttribute('draggable')
                    return
                } else {
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid black'
                    document.querySelectorAll(".img-producer")[currentOperationProduzir].style.display = 'none'
                    avanceArrow('produzir')
                    producer.down('mutex');
                }
                break;

            case "Up(mutex)":
                if (mutex == 1) {
                    if (ativo == false) return
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid red'
                    document.querySelectorAll('.img-producer')[currentOperationProduzir].style.display = 'block'
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].removeAttribute('draggable')
                    return
                } else {
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid black'
                    document.querySelectorAll(".img-producer")[currentOperationProduzir].style.display = 'none'
                    avanceArrow('produzir')
                    producer.up('mutex');
                }

                break;
            case "Up(full)":
                if (full >= tamBuffer.value) {
                    if (ativo == false) return
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid red'
                    document.querySelectorAll('.img-producer')[currentOperationProduzir].style.display = 'block'
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].removeAttribute('draggable')
                    return
                } else {
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid black'
                    document.querySelectorAll(".img-producer")[currentOperationProduzir].style.display = 'none'
                    avanceArrow('produzir')
                    producer.up('full');
                }

                break;
            case "Insert item":

                if (full >= tamBuffer.value) {
                    if (ativo == false) return
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid red'
                    document.querySelectorAll('.img-producer')[currentOperationProduzir].style.display = 'block'
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].removeAttribute('draggable')
                    return
                } else {
                    document.querySelectorAll(".producer-operation")[currentOperationProduzir].style.border = '1px solid black'
                    document.querySelectorAll(".img-producer")[currentOperationProduzir].style.display = 'none'
                    avanceArrow('produzir')
                    producer.insertItem();
                    break;
                }

        }


    }

}

let consControler = 0

const consumir = () => {


    const elementos = document.querySelectorAll('.consumer-operation');

    setTimeout(() => {
        elementos.forEach((elemento, index) => {
            elemento.draggable = false;
        });
    }, 400)


    updateListsProcess();

    if (Number(tamBuffer.value) < 1) return;

    if (currentOperationConsumer < listConsumer.length) {

        const operation = listConsumer[currentOperationConsumer].trim();

        switch (operation) {
            case "Down(full)":
                if (full == 0) {
                    if (ativo == false) return;
                    document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid red';
                    document.querySelectorAll('.img-consumer')[currentOperationConsumer].style.display = 'block';
                    document.querySelectorAll(".consumer-operation")[currentOperationConsumer].removeAttribute('draggable');
                    return;
                } else {
                    document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid black'
                    document.querySelectorAll(".img-consumer")[currentOperationConsumer].style.display = 'none'
                    avanceArrow('consumir');
                    consumer.down('full');
                    break;
                }
                case "Down(mutex)":
                    if (mutex == 0) {
                        if (ativo == false) return;
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid red';
                        document.querySelectorAll('.img-consumer')[currentOperationConsumer].style.display = 'block';
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].removeAttribute('draggable');
                        return;
                    } else {
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid black'
                        document.querySelectorAll(".img-consumer")[currentOperationConsumer].style.display = 'none'

                        avanceArrow('consumir');
                        consumer.down('mutex');

                    }
                    break;
                case "Up(mutex)":
                    if (mutex == 1) {
                        if (ativo == false) return;
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid red';
                        document.querySelectorAll('.img-consumer')[currentOperationConsumer].style.display = 'block';
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].removeAttribute('draggable');
                        return;
                    } else {
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid black'
                        document.querySelectorAll(".img-consumer")[currentOperationConsumer].style.display = 'none'

                        avanceArrow('consumir');
                        consumer.up('mutex');
                    }

                    break;
                case "Up(empty)":
                    if (full >= tamBuffer.value) {
                        if (ativo == false) return;
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid red';
                        document.querySelectorAll('.img-consumer')[currentOperationConsumer].style.display = 'block';
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].removeAttribute('draggable');
                        return;
                    } else {
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid black'
                        document.querySelectorAll(".img-consumer")[currentOperationConsumer].style.display = 'none'

                        avanceArrow('consumir');
                        consumer.up('empty');
                    }

                    break;
                case "Consume item":
                    if (document.querySelectorAll('.buffer-item')[0].style.background == 'white') {
                        if (ativo == false) return;
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid red';
                        document.querySelectorAll('.img-consumer')[currentOperationConsumer].style.display = 'block';
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].removeAttribute('draggable');
                        return;
                    } else {
                        document.querySelectorAll(".consumer-operation")[currentOperationConsumer].style.border = '1px solid black'
                        document.querySelectorAll(".img-consumer")[currentOperationConsumer].style.display = 'none'

                        avanceArrow('consumir');
                        consumer.consumeItem();
                    }
                    break;
                default:
        }
    }
}