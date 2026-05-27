plugins {
    kotlin("jvm") version "1.9.0"
    id("maven-publish")
}

group = "com.edmilsonmuacigarro"
version = "0.3.1"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
