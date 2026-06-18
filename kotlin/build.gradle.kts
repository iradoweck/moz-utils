plugins {
    kotlin("jvm") version "2.3.21"
    id("maven-publish")
}

group = "com.edmilsonmuacigarro"
version = "0.3.9"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
