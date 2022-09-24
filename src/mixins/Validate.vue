<script>
import { required, email, max, confirmed, size, min } from 'vee-validate/dist/rules'
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate'

extend('required', {
  ...required,
  message: '{_field_} 항목을 입력해 주세요.'
})
extend('required-select', {
  ...required,
  message: '{_field_} 항목을 입력해 주세요.'
})
extend('email', {
  ...email,
  message: '이메일 형식이 올바르지 않습니다.'
})
extend('max', {
  ...max,
  message: '{_field_} 항목을 {length}자 이하로 입력해 주세요.'
})
extend('min', {
  ...min,
  message: '{_field_} 항목을 {length}자 이상으로 입력해 주세요.'
})
extend('confirmed', {
  ...confirmed,
  message: '비밀번호가 맞지 않습니다.'
})
extend('size', {
  ...size,
  message: '비디오 용량({length})이 5MB를 초과할 수 없습니다.'
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  }
}
</script>
