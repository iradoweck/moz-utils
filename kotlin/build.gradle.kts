plugins {
    kotlin("jvm") version "2.3.20"
    id("maven-publish")
}

group = "com.edmilsonmuacigarro"
version = "0.4.0" // x-release-please-version

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
