"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteBtnBoolean = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //Show the favorites star if the user is logged in
  const star = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        <div>
        ${star ? makeStar(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        ${deleteBtnBoolean ? makeDeleteBtn() : ''}
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}

// Make the favorite star
function makeStar (story, user){
  const favoriteBoolean = user.favoriteBoolean(story);
  const isStar = favoriteBoolean ? 'fas' : 'far';
  return `<span class='star'><i class='${isStar} fa-star'></i></span>`;
}

//Make the delete story button
function makeDeleteBtn(){
  return `<span class='deleteBtn'><i class='fas fa-trash-alt'></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/**Submits new story form */
async function submitStory(e){
  e.preventDefault();
  console.debug('submitStory');

  //Gets info from form
  const title = $('#make-title').val();
  const author= $('#make-author').val();
  const url = $('#make-url').val();
  const user = currentUser.username;
  const data = {title, author, url, user};
  const story = await storyList.addStory(currentUser, data);
  const genStory = generateStoryMarkup(story);

  $allStoriesList.prepend(genStory);

  //Hides and resets submittion form
  $storyForm.trigger('reset');
  $storyForm.slideUp('slow');
}
$storyForm.on('submit', submitStory);

// Deletes a story from the form
async function deleteStory(e){
  console.debug("deleteStory");
  const $closest = $(e.target).closest('li');
  const id = $closest.attr('id');

  await storyList.removeStory(currentUser, id);
  putMyStoriesOnPage();
  
}
$myStories.on('click', '.deleteBtn', deleteStory);

//Puts favorites list on the page
function putFavoritesOnPage(){
  console.debug("putFavoritesOnPage");
  $favoritesList.empty();

  if(currentUser.favorites.length === 0){
    $favoritesList.append('<p>You have not favorited any stories yet.</p>');
  } else {
    for(let favorite of currentUser.favorites){
      const genStory = generateStoryMarkup(favorite);
      $favoritesList.append(genStory)
    }
  }
  $favoritesList.show();
}

//Toggles the favorite and unfavorite
async function toggleFavoritesList(e){
  console.debug('toggleFavoritesList')
  const $target = $(e.target);
  const $targetLi = $target.closest('li');
  const storyId = $targetLi.attr('id');
  const story = storyList.stories.find(x => x.storyId === storyId);
  
  if($target.hasClass('fas')){
    await currentUser.unFavorite(story);
    $target.closest('i').toggleClass('fas far');
  }else {
    await currentUser.favorite(story);
    $target.closest('i').toggleClass('fas far');
  }
} 
$storiesListClass.on('click', '.star', toggleFavoritesList);

//Put the users story on the page
function putMyStoriesOnPage(){
  console.debug('putMyStoriesOnPage');
  $myStories.empty();

  if(currentUser.ownStories.length === 0){
    $myStories.append('<p>You have not submitted a story yet.</p>');
  } else {
    for(let story of currentUser.ownStories){
      let genStory = generateStoryMarkup(story, true);
      $myStories.append(genStory);
    }
  }
  $myStories.show();
}

