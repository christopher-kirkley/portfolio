BASE_URL = "http://localhost:8000?graphql";

const content = {
query: `
  {
    posts {
        nodes {
          postId
          title
          date
          featuredImage {
            node {
                mediaItemUrl
                }
            }
          }
    }
    generalSettings {
     title
     description
     }
  }
`};



const UIMethods = (function UIMethodsIIFE() {

    // Cache DOM
    const portfolio_main = document.querySelector('.portfolio_main');
    const item_main = document.querySelector('.item_main');
    const hero_wrapper = document.querySelector('.hero_wrapper')

    const toggle = (className) => {
        const element = document.querySelector('.' + className);
        element.classList.toggle("hidden")
    }

    const renderItem = (data) => {
        const div = document.createElement('div');
        div.innerText ='sup'

        //do stuff


        item_main.appendChild(div);
    }

    const renderGrid = (data) => {
        const posts = data["data"]["posts"]["nodes"];
        posts.map((post) => {
            const div = document.createElement('div');
            div.classList.add('portfolio_item');
            div.id = post["postId"];

            if (post["featuredImage"]) {
                const img_url = post["featuredImage"]["node"]["mediaItemUrl"]; 
                const img = document.createElement('img');
                img.src = img_url
                img.classList.add('portfolio_image')
                div.appendChild(img);
            }
            const p = document.createElement('p');
            p.innerText = post.title;
            div.append(p)
            div.onclick = showItem;

            portfolio_main.appendChild(div);
        })
    }

    const renderTitle = (data) => {
        const generalSettings = data["data"]["generalSettings"];
        const div = document.createElement('div');
        div.classList.add('column_left');
        const h1 = document.createElement('h1');
        h1.innerText = generalSettings.title;
        const p = document.createElement('p');
        p.innerText = generalSettings.description;
        div.appendChild(h1);
        div.appendChild(p);
        hero_wrapper.prepend(div);
    }

    return {
        toggle: toggle,
        renderGrid: renderGrid,
        renderTitle: renderTitle,
        renderItem: renderItem
    }

})();


let body = JSON.stringify(content);

const init = async () => {
    const resp = await fetch(BASE_URL, {
        method: 'post',
        headers: {
        'Content-Type': 'application/json'
          },
          body: body
        })
    const data = await resp.json();

    console.log(data);
    UIMethods.renderGrid(data);
    UIMethods.renderTitle(data);
}



const showItem = async (e) => {
    const id = e.currentTarget.id;
    
    const content = {
    query: `
      {
        post(id: ${id}, idType: DATABASE_ID) {
            title
            content
      }
      }
    `};

    let body = JSON.stringify(content);

    UIMethods.toggle('portfolio')
    UIMethods.toggle('item')

    const resp = await fetch(BASE_URL, {
        method: 'post',
        headers: {
        'Content-Type': 'application/json'
        },
        body: body
    });

    const data = await resp.json();
    
    UIMethods.renderItem(data);
}


init();
