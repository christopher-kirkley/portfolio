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

const toggle = (className) => {
    const element = document.querySelector('.' + className);
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

const renderItem = (data) => {
    console.log('hi')


}

let body = JSON.stringify(content);

fetch('http://localhost:8000?graphql=true', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: body
})
  .then(response => response.json())
  .then(data => {
      console.log(data);
      renderGrid(data);
      renderTitle(data);
  });


const showItem = (e) => {
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

    toggle('portfolio')
    toggle('item')

    fetch('http://localhost:8000?graphql=true', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then(response => response.json())
      .then(data => {
          renderItem(data);
    })

}

const renderGrid = (data) => {
    const posts = data["data"]["posts"]["nodes"];
    const portfolio_main = document.querySelector('.portfolio_main');
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
    const hero_wrapper = document.querySelector('.hero_wrapper')
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


