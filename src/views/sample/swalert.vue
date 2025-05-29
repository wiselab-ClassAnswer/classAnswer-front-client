<template>
    <div>
        <div>
            <input type="button" @click="alert" value="일반" />
            <input type="button" @click="titleAlert" value="제목" />
            <input type="button" @click="keyAlert" value="키값셋팅" />
            <input type="button" @click="threeButtonAlert" value="3버튼" />
            <input type="button" @click="animationAlert" value="에니메이션" />
            <input type="button" @click="imageAlert" value="이미지" />
            <input type="button" @click="confirm" value="확인창" />
        </div>
        <div>
            https://sweetalert2.github.io/#examples
        </div>
    </div>
</template>

<script>

export default {
    data: function() {
		return {
            
        }
    },
    methods: {
        init: function() {
            // this.$swal({
            //     title: 'Are you sure?',
            //     text: "You won't be able to revert this!",
            //     icon: 'warning',
            //     showCancelButton: true,
            //     confirmButtonColor: '#3085d6',
            //     cancelButtonColor: '#d33',
            //     confirmButtonText: 'Yes, delete it!',
            //     cancelButtonText: 'No, delete it!'
            // });
        },
        alert: function() {
            this.$swal('일반 텍스트 알림창');
        },
        titleAlert: function() {
            this.$swal(
                'The Internet?',
                'That thing is still around?',
                'question'
            )
        },
        keyAlert: function() {
            this.$swal({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            });
        },
        threeButtonAlert: function() {
            const $this = this;
            this.$swal({
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $this.$swal('Saved!', '', 'success');
                } else if (result.isDenied) {
                    $this.$swal('Changes are not saved', '', 'info');
                }
            });
        },
        animationAlert: function() {
            this.$swal({
                title: 'Custom animation with Animate.css',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
        },
        imageAlert: function() {
            this.$swal({
                title: 'Sweet!',
                text: 'Modal with a custom image.',
                imageUrl: 'https://unsplash.it/400/200',
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
            });
        },
        confirm: function() {
            const $this = this;
            this.$swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0099d8',
                cancelButtonColor: '#5a5b5b',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $this.$swal(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                }
            })
        }
    },
    updated: function () {
    
    },
    computed: {
    
    },
    watch: {
    
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
