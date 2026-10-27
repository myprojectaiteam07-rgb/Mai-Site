window.addEventListener('DOMContentLoaded', () => {
    fetch('testimonials.json')
        .then(response => response.json())
        .then(data => {
         const testimonialContainer = document.getElementById('testimonialContainer');
         data.forEach(testimonial => {
            const { name, image, content } = testimonial;
            const html = `
             <div class="col-lg-4 col-md-6 testimonial_Box" style="align-self: stretch;" data-aos="zoom-in" data-aos-delay="100">
                <div class="icon-box iconbox-red h-100" style="flex:1;">
                 <img class="testimonialImage" style="border-radius: 50%; border: 4px solid #DBE7F1; object-fit: cover;"
                    src="${image}" alt="${name} Profile" />
                 <h2 class="text-uppercase fw-bold mt-2 mb-2" style="color: #003f6b;">${name}</h2>
                 <p class="mt-1 fw-semibold p-3"><span style="color: #003f6b; font-size: 25px;">❝</span>${content}<span style="color: #003f6b; font-size: 25px;">❞</span></p>
                </div>
             </div>
            `;
            testimonialContainer.innerHTML += html;
         });
        })
        .catch(error => console.error('Error fetching testimonials:', error));
    });

/* career page */

window.addEventListener('DOMContentLoaded', () => {
   fetch('careers.json')
       .then(response => response.json())
       .then(data => {
        const careerContainer = document.getElementById('careerContainer');
        data.forEach(career => {
           const { job_name, job_description, job_detailview_url } = career;
           const careerHtml = `<div class="col-lg-4 col-md-6 mt-4 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100">
           <div class="icon-box iconbox-red careerContainer" style="display:flex;flex-direction:column;justify-content:space-between">
           <div>
             <h2 class="p p1"><a href="${job_detailview_url}" target="_blank" rel="noopener noreferrer" aria-describedby="a11y-new-window-message">${job_name} </a></h2>
             <p class="fifty-chars mb-3">${job_description}
             </p>
             </div>
             <div>
             <div style=" display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <p style="color: #003f6b; font-weight: 700; " class="mt-2 mb-3">Location: <span style="font-weight: bold; text-decoration: underline;"><a href="https://maps.app.goo.gl/tekQfepa1KMrRoUo7" target="_blank" rel="noopener noreferrer" aria-describedby="a11y-new-window-message">Ambattur</a></span>, Chennai</p>
               <div class="stylablebutton643855516__container" style="width: 200px;">
                 <a href="${job_detailview_url}" target="_blank" rel="noopener noreferrer" aria-describedby="a11y-new-window-message">
                   <button class="text-uppercase border-0 btn applyNowBtn">Apply Now</button>
                 </a>
               </div></div>
               </div>
           </div>
        
       </div>`;
           careerContainer.innerHTML += careerHtml;
        });
       })
       .catch(error => console.error('Error fetching for careers:', error));
   });

 /* Career Detail Page */
 /*window.addEventListener('DOMContentLoaded', ()=>{
  const blinkAnimateContainer = document.getElementById('blink_image');
  console.log(blinkAnimateContainer)
  const blinkSrcElements = ["/assets/img/Career Detail Page/We Collabrate.png", "/assets/img/Career Detail Page/We Deliver.png", "/assets/img/Career Detail Page/We Listen.png"];
   for(let i=0; i<=2; i++){
     const animateImage = document.createElement("img");
     animateImage.setAttribute("width", "200px");
     animateImage.setAttribute("height", "200px");
     animateImage.setAttribute("src", `${blinkSrcElements[i]}`);
     blinkAnimateContainer.appendChild(animateImage);    
    console.log (blinkSrcElements[i])
     if(i>=1){
   // animateImage.previousElementSibling.remove();
    }
    }
    
     
 }) */
 /* career Detail Page */
 
 window.addEventListener('DOMContentLoaded', () => {
   const blinkAnimateContainer = document.getElementById('blink_image');
   const blinkSrcElements = [
     "/assets/img/Career Detail Page/We Collabrate.png",
     "/assets/img/Career Detail Page/We Deliver.png",
     "/assets/img/Career Detail Page/We Listen.png"
   ];
 
   let currentIndex = 0;
   const animateImage = document.createElement("img");
   animateImage.setAttribute("width", "300px");
   animateImage.setAttribute("height", "300px");
   blinkAnimateContainer.appendChild(animateImage);
 
   function changeImage() {
     animateImage.setAttribute("src", blinkSrcElements[currentIndex]);
     currentIndex = (currentIndex + 1) % blinkSrcElements.length;
   }
 
   // Initial call
   changeImage()
    // Start continuous animation
   setInterval(()=>{
    changeImage();
   }, 2000); // Change image every 1000 milliseconds (1 second)
   
   
 });


 
 

/* About Us */


/*function isInViewport(element) {
  var rect = element.getBoundingClientRect();
  console.log(rect);

  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );*/

let founder_image_container = document.getElementById('founder_animate_container1');
let founder_text_container = document.getElementById('founder_animate_container2');

/*
function founderAnimate(element){
    let rect = element.getBoundingClientRect();
    console.log(rect);
    return(
      rect.top>=0 &&
      rect.left>=0 &&
      rect.bottom<=(window.innerheight || document.documentElement.clientHeight) &&
      rect.right<=(window.innerWidth || document.documentElement.clientWidth)
    );
}
founderAnimate(founder_image_container);


function handleScroll() {
  if (founderAnimate(founder_image_container)) {
    founder_image_container.classList.add('slide_left_animate');
    console.log(founder_image_container.getAttribute('class'));
  }

  if (founderAnimate(founder_text_container)) {
    founder_text_container.classList.add('slide_right_animate');
    console.log(founder_text_container.getAttribute('class'));
  }
}
// Add scroll event listener
window.addEventListener('DOMContentLoaded', handleScroll);
window.addEventListener('scroll', handleScroll);
// Initial check on page load
*/
// intersection method
/*const observer = new IntersectionObserver((entries)=>{
              entries.forEach((entry)=>{
                 console.log(entry);
                 if(entry.isIntersecting){
                   entry.target.classList.add('slide_left_animate');
                   entry.target.classList.add('slide_right_animate');
                   } else {
                    entry.target.classList.remove('slide_left_animate');
                    entry.target.classList.remove('slide_right_animate');
                   }
              });
});

observer.observe(founder_image_container);
observer.observe(founder_text_container);*/
/*
document.addEventListener('DOMContentLoaded', function() {
    // Animation on page load
    founder_image_container.classList.add('slide_left_animate');
    founder_text_container.classList.add('slide_right_animate');
    // Animation on scroll
    });
    
    window.addEventListener('scroll', function() {
      var scrollPosition = window.scrollY;
      var windowHeight = window.innerHeight;
      
      console.log(`scrollPosition: ${scrollPosition}`); 
      console.log(`windowHeight: ${windowHeight}`);
      console.log(`formula${scrollPosition > windowHeight}`);
 
     // Trigger animation when scroll position is halfway through the viewport
    if (scrollPosition > windowHeight / 2) {
        founder_image_container.classList.add('slide_left_animate');
        founder_text_container.classList.add('slide_right_animate');}
      else if(scrollPosition<windowHeight/2){
        founder_image_container.classList.remove('slide_left_animate');
        founder_text_container.classList.remove('slide_right_animate');
      }
  });*/

let sabCardThree = document.getElementById('sab_card_three');
let sabCardTwo = document.getElementById('sab_card_two');
window.addEventListener('scroll', function() {
  let scrollingPosition = window.scrollY;
  let heightofWindow = window.innerHeight;
  
  console.log(`scrollPosition: ${scrollingPosition}`); 
  console.log(`windowHeight: ${heightofWindow}`);
  console.log(`formula${scrollingPosition > heightofWindow}`);

 // Trigger animation when scroll position is halfway through the viewport
if (scrollingPosition > heightofWindow / 2) {
   sabCardThree.classList.add('home_card-three');
   sabCardTwo.classList.add('home_card-two');}
  else if((scrollingPosition < heightofWindow / 2)){
    sabCardThree.classList.remove('home_card-three');
    sabCardTwo.classList.remove('home_card-two');
  }
});


 