<template>
  <footer
    class="flex flex-col bg-black text-white justify-center items-center py-2 gap-2 flex-grow-0 flex-shrink-0"
  >
    <div class="flex flex-row">
      <v-btn
        v-for="link in links"
        :key="link"
        class="mx-2"
        color="white"
        rounded="xl"
        variant="text"
      >
        {{ link }}
      </v-btn>
    </div>
    <div class="text-center">
      {{ new Date().getFullYear() }} — <strong>NOTiON</strong>
    </div>
    <nav class="flex space-x-4 md:space-x-8">
      <a
        href="#"
        class="flex items-center space-x-2 !text-white md:!text-gray-400 hover:!text-white"
      >
        <HomeIcon class="w-5 h-5" />
        <span class="hidden md:inline">HOME</span>
      </a>
      <a
        href="#"
        class="flex items-center space-x-2 !text-white md:!text-gray-400 hover:!text-white"
      >
        <AboutIcon class="w-5 h-5" />
        <span class="hidden md:inline">ABOUT US</span>
      </a>
      <a
        href="#"
        class="flex items-center space-x-2 !text-white md:!text-gray-400 hover:!text-white"
      >
        <TeamIcon class="w-5 h-5" />
        <span class="hidden md:inline">TEAM</span>
      </a>
      <a
        href="#"
        class="flex items-center space-x-2 !text-white md:!text-gray-400 hover:!text-white"
      >
        <ServicesIcon class="w-5 h-5" />
        <span class="hidden md:inline">SERVICES</span>
      </a>
      <a
        href="#"
        class="flex items-center space-x-2 !text-white md:!text-gray-400 hover:!text-white"
      >
        <BlogIcon class="w-5 h-5" />
        <span class="hidden md:inline">BLOG</span>
      </a>
      <a
        href="#"
        class="flex items-center space-x-2 !text-white md:!text-gray-400 hover:!text-white"
      >
        <ContactIcon class="w-5 h-5" />
        <span class="hidden md:inline">CONTACT US</span>
      </a>
    </nav>
  </footer>
</template>
<script setup>
import HomeIcon from "../components/icons/Home.vue"
import AboutIcon from "../components/icons/About.vue"
import TeamIcon from "../components/icons/Team.vue"
import ServicesIcon from "../components/icons/Service.vue"
import BlogIcon from "../components/icons/Blog.vue"
import ContactIcon from "../components/icons/Contact.vue"
</script>
