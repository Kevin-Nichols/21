"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */


/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);


/** un-hide the submit form upon clicking submit on the nav bar */
function navSubmitClick(evt){
console.debug('navSubmitClick', evt);
hidePageComponents();
$storyForm.show();
$allStoriesList.show();
}
$navSubmit.on('click', navSubmitClick);


/** un-hide the favorites list upon clicking favorites on the nav bar */
function navFavoriteClick(evt){
  console.debug('navFavoriteClick', evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$body.on('click', "#nav-favorite", navFavoriteClick);


/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/**Show My Stories upon clicking */
function navMyStoriesClick(e){
  console.debug('navMyStoriesClick', e);
  hidePageComponents();
  putMyStoriesOnPage();
  $myStories.show();
}
$body.on("click", "#nav-my-stories", navMyStoriesClick);